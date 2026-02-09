# Bảng Test Case: Tái Hiện & Kiểm Tra Lỗi Tồn Kho Ảo

---

**Mục đích:** Tài liệu này cung cấp các kịch bản kiểm thử (Test Cases) chi tiết để **tái hiện lỗi tồn kho ảo** (nhằm xác nhận nguyên nhân) và **kiểm chứng giải pháp** sau khi đã fix.

**Người thực hiện:** QC/Tester & Developer  
**Môi trường:** Staging (Tuyệt đối không chạy trên Production nếu chưa có sự cho phép)

---

## 🏗️ Chuẩn Bị Dữ Liệu (Pre-conditions)

Trước khi thực hiện bất kỳ test case nào, hãy đảm bảo:
1.  **Sản phẩm Test:** Tạo 1 sản phẩm mới tên `SP_TEST_PHANTOM` (để không ảnh hưởng tồn kho thật).
2.  **Tồn kho ban đầu:** Set tồn kho `inStockQuantity = 10` tại Kho A (`StoreId = 1`).
3.  **Công cụ:** Sử dụng Postman hoặc script (JMeter/K6) để gửi request đồng thời (Concurrent Requests).

---

## 🧪 Danh Sách Test Case

### 1. TC-01: Race Condition - Đổi Trạng Thái Đơn Hàng (CRITICAL)

**Mục tiêu:** Tái hiện lỗi trừ tồn kho không đúng khi nhiều request cập nhật cùng lúc.

| Bước | Hành Động (Action) | Dữ Liệu Đầu Vào | Kết Quả Mong Đợi (Sau Fix) | Kết Quả Hiện Tại (Lỗi) |
|------|--------------------|-----------------|----------------------------|------------------------|
| 1 | Tạo 20 đơn hàng cho `SP_TEST_PHANTOM` | Mỗi đơn mua 1 sản phẩm | 20 đơn trạng thái "Mới" | |
| 2 | Chuẩn bị Script chạy song song | 20 luồng (Threads) | Script sẵn sàng | |
| 3 | **Thực thi:** Gọi API đổi trạng thái | Từ "Mới" -> "Thành công" | **10 đơn thành công** (vì tồn chỉ có 10). **10 đơn báo lỗi**. Tồn kho = 0. | **> 10 đơn thành công**. Tồn kho âm (ví dụ: -5) hoặc vẫn còn dương (ví dụ: 2) dù đã bán quá số lượng. |
| 4 | Kiểm tra DB | `SELECT * FROM ProductStocks` | `inStockQuantity = 0` | `inStockQuantity != 0` (Sai lệch) |

**Phân tích lỗi:** Nếu kết quả hiện tại xảy ra, chứng tỏ hệ thống đang đọc dữ liệu cũ ("Dirty Read") và ghi đè lên nhau.

---

### 2. TC-02: Idempotency - Spam Request Nhập Kho Bảo Hành

**Mục tiêu:** Kiểm tra xem hệ thống có tạo nhiều phiếu nhập kho khi Dpos gửi lại request (Retry) hay không.

| Bước | Hành Động (Action) | Dữ Liệu Đầu Vào | Kết Quả Mong Đợi (Sau Fix) | Kết Quả Hiện Tại (Lỗi) |
|------|--------------------|-----------------|----------------------------|------------------------|
| 1 | Chuẩn bị Payload nhập kho | `productId`, `storeId`, `qty=1`, `idempotencyKey="TEST-KEY-001"` | Payload hợp lệ | |
| 2 | **Thực thi:** Gửi liên tiếp 5 Request | Cùng 1 Payload & Key | Request 1: 200 OK. Request 2-5: 200 OK (trả về kết quả cũ). | Request 1-5: Đều 200 OK và **tạo 5 phiếu mới**. |
| 3 | Kiểm tra DB | `SELECT count(*) FROM StockSlips` | **Count = 1** | **Count = 5** |
| 4 | Kiểm tra Tồn kho BH | `warrantyQuantity` | Tăng 1 | Tăng 5 (Sai lệch) |

**Phân tích lỗi:** Nếu tạo 5 phiếu, hệ thống thiếu cơ chế kiểm tra `idempotencyKey`.

---

### 3. TC-03: Distributed Transaction - Chuyển Kho Lỗi (Giả Lập)

**Mục tiêu:** Đảm bảo tính toàn vẹn dữ liệu khi chuyển kho gặp sự cố giữa chừng.

*Lưu ý: Test case này cần Developer hỗ trợ thêm đoạn code `throw new Error("Simulated Error")` vào giữa bước trừ kho và cộng kho trong code.*

| Bước | Hành Động (Action) | Dữ Liệu Đầu Vào | Kết Quả Mong Đợi (Sau Fix) | Kết Quả Hiện Tại (Lỗi) |
|------|--------------------|-----------------|----------------------------|------------------------|
| 1 | Set tồn kho | Kho A: 10, Kho B: 0 | | |
| 2 | **Thực thi:** Gọi API Chuyển Kho | Chuyển 5 sp từ A -> B | API trả về lỗi 500 (do giả lập). | API trả về lỗi 500. |
| 3 | Kiểm tra DB | `SELECT * FROM ProductStocks` | **Kho A: 10** (Rollback về cũ). **Kho B: 0**. | **Kho A: 5** (Đã trừ nhưng chưa cộng). **Kho B: 0** (Chưa cộng). => Mất 5 sp. |

**Phân tích lỗi:** Nếu Kho A bị trừ mà Kho B không nhận được, hệ thống không sử dụng Transaction hoặc Transaction không bao trùm cả 2 bước.

---

### 4. TC-04: Tồn Kho Âm (Negative Stock)

**Mục tiêu:** Đảm bảo không bao giờ có trường hợp trừ quá số lượng tồn.

| Bước | Hành Động (Action) | Dữ Liệu Đầu Vào | Kết Quả Mong Đợi (Sau Fix) | Kết Quả Hiện Tại (Lỗi) |
|------|--------------------|-----------------|----------------------------|------------------------|
| 1 | Set tồn kho | `inStockQuantity = 5` | | |
| 2 | **Thực thi:** Gọi API Bán Hàng | Mua số lượng 10 | API báo lỗi: "Không đủ tồn kho". | API báo lỗi hoặc cho phép (lỗi). |
| 3 | Kiểm tra DB | `inStockQuantity` | **Vẫn là 5** | **-5** (Cho phép âm). |

---

## 🛠️ Hướng Dẫn Script Tái Hiện (Node.js Example)

Dưới đây là một đoạn script đơn giản để chạy TC-01 (Race Condition):

```javascript
const axios = require('axios');

const TOTAL_REQUESTS = 20;
const API_URL = 'http://localhost:3000/api/orders/update-status';
const AUTH_TOKEN = 'YOUR_TOKEN_HERE';

async function runTest() {
    console.log(`🚀 Bắt đầu gửi ${TOTAL_REQUESTS} requests đồng thời...`);
    
    const requests = [];
    for (let i = 0; i < TOTAL_REQUESTS; i++) {
        requests.push(
            axios.post(API_URL, {
                orderId: `ORDER_TEST_${i}`,
                status: 'SUCCESS' 
            }, {
                headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
            }).catch(err => ({ status: 'FAILED', error: err.message }))
        );
    }

    const results = await Promise.all(requests);
    
    const successCount = results.filter(r => r.status === 200 || r.data).length;
    const failCount = results.length - successCount;
    
    console.log(`✅ Thành công: ${successCount}`);
    console.log(`❌ Thất bại: ${failCount}`);
    console.log(`👉 Hãy kiểm tra DB ngay bây giờ!`);
}

runTest();
```
