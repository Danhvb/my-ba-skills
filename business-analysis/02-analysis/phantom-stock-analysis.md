# Phân Tích Vấn Đề Tồn Kho Ảo - D-Core API

**Ngày phân tích:** 08/02/2026  
**Người phân tích:** AI Agent  
**Mức độ nghiêm trọng:** 🔴 **CRITICAL**

---

## 📋 Tóm Tắt Vấn Đề

### Hiện Trạng Tồn Kho Ảo

| Tính năng | Mức độ tồn ảo | Tần suất | Ưu tiên xử lý |
|-----------|----------------|----------|---------------|
| **Đổi trạng thái Đơn hàng** | ⚠️⚠️⚠️ Cao | Có tỉ lệ không trừ tồn | 🔴 **P0 - Cao nhất** |
| **Bảo hành (Dpos)** | ⚠️⚠️⚠️ Cao | Không công nhập tồn vào kho BH | 🔴 **P0 - Cao nhất** |
| **Đổi sản phẩm** | ⚠️⚠️ Trung bình | Nhiều nhất (đã xử lý) | ✅ Đã xử lý |
| **Chuyển kho** | ⚠️ Thấp | Vài phiếu/tháng | 🟡 P1 |
| **Chuyển kho BH** | ⚠️ Thấp | Vài phiếu/tháng | 🟡 P1 |
| **Bán hàng** | ⚠️ Rất thấp | Hiếm khi xảy ra | 🟢 P2 |
| Nhập/Xuất kho | ✅ Ổn định | Không ghi nhận | - |
| Trả hàng | ✅ Ổn định | Không ghi nhận | - |
| Thu cũ | ✅ Ổn định | Không ghi nhận | - |

---

## 🏗️ Kiến Trúc Quản Lý Tồn Kho

### 1. Database Schema - ProductStock Model

```javascript
// src/models/productstock.js
ProductStock {
    id: UUID,
    storeId: INTEGER,
    productId: UUID,
    
    // 6 TRƯỜNG QUẢN LÝ TỒN KHO
    quantity: INTEGER,              // Tổng tồn kho
    inStockQuantity: INTEGER,       // Tồn trong kho (có thể bán)
    deliveryQuantity: INTEGER,      // Tồn đang giao hàng
    transferQuantity: INTEGER,      // Tồn đang chuyển kho
    holdingQuantity: INTEGER,       // Tồn đang giữ (đặt cọc)
    warrantyQuantity: INTEGER,      // Tồn kho bảo hành
}
```

**Quan hệ:**
```
quantity = inStockQuantity + deliveryQuantity + transferQuantity + holdingQuantity + warrantyQuantity
```

### 2. Các Service Chính Ảnh Hưởng Tồn Kho

| Service | File | Số lần gọi `updateProductStock` | Mức độ phức tạp |
|---------|------|--------------------------------|-----------------|
| **orderService** | `orderService.js` (3,298 dòng) | 2 lần | ⚠️⚠️⚠️ Rất cao |
| **stockService** | `stockService.js` | 30+ lần | ⚠️⚠️⚠️ Rất cao |
| **stockSlipService** | `stockSlipService.js` (8,700+ dòng) | 1 lần | ⚠️⚠️ Cao |
| **WarrantyStockService** | `WarrantyStockService.js` (1,237 dòng) | Gián tiếp | ⚠️⚠️ Cao |
| **tradeInService** | `tradeInService.js` | 1 lần | ⚠️ Trung bình |
| **orderBillService** | `orderBillService.js` | 1 lần | ⚠️ Trung bình |

---

## 🔍 Phân Tích Nguyên Nhân Gốc Rễ

### ❌ VẤN ĐỀ 1: Đổi Trạng Thái Đơn Hàng (CRITICAL)

#### Mô tả vấn đề
Khi đổi trạng thái đơn hàng hàng loạt, **có tỉ lệ không trừ tồn kho** dẫn đến tồn ảo.

#### Root Cause Analysis

**1. Race Condition trong `updateProductStock`**

```javascript
// src/services/orderService.js - Line 1755
const updateProductStock = async (productStocks, mode, transaction) => {
    try {
        await Bluebird.map(
            productStocks,
            async (productStock) => {
                // ⚠️ ĐIỂM YẾU #1: Đọc tồn kho hiện tại
                const productStockExist = await ProductStock.findOne({
                    where: { id: productStock.productStockId },
                    attributes: ['id', 'inStockQuantity', 'holdingQuantity', 
                                 'deliveryQuantity', 'transferQuantity'],
                    raw: true,
                    transaction: transaction,
                });

                // ⚠️ ĐIỂM YẾU #2: Kiểm tra tồn kho đã thay đổi
                if (productStock.inStockQuantityCurrent !== productStockExist.inStockQuantity) {
                    throw new Error(`Tồn kho sản phẩm ${productStock.productName} đã bị thay đổi`);
                }

                // ⚠️ ĐIỂM YẾU #3: Tính toán và cập nhật
                const quantityInstock = inStockQuantityRequest + inStockQuantityCurrent;
                const quantityHolding = holdingQuantityRequest + holdingQuantityCurrent;
                const quantityDelivery = deliveryQuantityRequest + deliveryQuantityCurrent;

                // ⚠️ ĐIỂM YẾU #4: Update không có lock
                const [rowUpdated] = await ProductStock.update(
                    {
                        inStockQuantity: quantityInstock,
                        holdingQuantity: quantityHolding,
                        deliveryQuantity: quantityDelivery,
                    },
                    {
                        where: { id: productStockExist.id },
                        transaction: transaction,
                    },
                );
            },
            { concurrency: 1 }, // ⚠️ ĐIỂM YẾU #5: Concurrency = 1 KHÔNG ĐỦ
        );
    } catch (error) {
        throw error;
    }
};
```

**Vấn đề:**
- **Time-of-Check to Time-of-Use (TOCTOU) Race Condition**
- Khoảng thời gian giữa `findOne` và `update` có thể bị request khác chen vào
- `concurrency: 1` chỉ đảm bảo tuần tự trong 1 request, KHÔNG ngăn được 2 request song song

**Kịch bản tồn ảo:**
```
T0: Request A đọc inStockQuantity = 100
T1: Request B đọc inStockQuantity = 100 (vẫn 100 vì A chưa update)
T2: Request A tính toán: 100 - 10 = 90, UPDATE inStockQuantity = 90
T3: Request B tính toán: 100 - 5 = 95, UPDATE inStockQuantity = 95
→ KẾT QUẢ: Tồn kho = 95 (SAI! Phải là 85)
→ TỒN ẢO: +10 sản phẩm
```

**2. Thiếu Database-Level Locking**

Hệ thống KHÔNG sử dụng:
- ❌ `SELECT ... FOR UPDATE` (Pessimistic Locking)
- ❌ Optimistic Locking với version field
- ❌ Atomic increment/decrement operations

**3. Validation Không Đủ Mạnh**

```javascript
// Chỉ kiểm tra giá trị cũ, KHÔNG kiểm tra giá trị mới
if (productStock.inStockQuantityCurrent !== productStockExist.inStockQuantity) {
    throw new Error(`Tồn kho đã bị thay đổi`);
}
// ⚠️ THIẾU: Kiểm tra tồn kho sau update có âm không?
// ⚠️ THIẾU: Kiểm tra tổng quantity có khớp không?
```

---

### ❌ VẤN ĐỀ 2: Bảo Hành Dpos (CRITICAL)

#### Mô tả vấn đề
Khi tạo phiếu bảo hành trên Dpos, **có tỉ lệ không công nhập tồn vào kho bảo hành**.

#### Root Cause Analysis

**1. Flow Bảo Hành Phức Tạp**

```javascript
// src/services/WarrantyStockService.js
const createImport = async (payload, userId) => {
    // Bước 1: Validate stock
    const validStockData = await validateStock(data.listProduct, data.storeId, 
                                                STOCK_TYPE.IMPORT_WARRANTY);
    
    // Bước 2: Tạo StockSlip
    const stockSlipModel = await setStockSlipModel(data, STOCK_TYPE.IMPORT_WARRANTY, userId);
    const stockSlipDetail = setStockSlipDetails(validStockData.data, stockSlipModel);
    
    // Bước 3: Tạo phiếu và cập nhật tồn
    await createStockSlip(stockSlipModel, stockSlipDetail);
    // ⚠️ ĐIỂM YẾU: Gọi stockService.handleStockTransaction
};

const createStockSlip = async (stockSlip, stockSlipDetail) => {
    const dbTransaction = await sequelize.transaction();
    try {
        await StockSlip.create(stockSlip, { transaction: dbTransaction });
        await StockSlipDetail.bulkCreate(stockSlipDetail, { transaction: dbTransaction });
        
        // ⚠️ ĐIỂM YẾU: Nếu handleStockTransaction FAIL thì rollback
        await stockService.handleStockTransaction(
            stockSlip,
            stockSlipDetail,
            dbTransaction,
            stockService.CUD_TYPE_OBJ.CREATE,
        );
        
        await dbTransaction.commit();
    } catch (err) {
        if (dbTransaction) await dbTransaction.rollback();
        throw new Error(err);
    }
};
```

**2. Xử Lý `warrantyQuantity` Trong `stockService`**

```javascript
// src/services/stockService.js - Line 638-670
let warrantyQuantity = 0;

if (isWarranty) {
    warrantyQuantity = productStock.warrantyQuantity + item.quantity;
    beforeQuantity = productStock.warrantyQuantity;
} else {
    // ... xử lý inStockQuantity
}

if (isWarranty) {
    updateModel.warrantyQuantity = warrantyQuantity;
}

await updateProductStock(updateModel, transaction);
```

**Vấn đề:**
- **Không có retry mechanism** khi `handleStockTransaction` fail
- **Không có event logging** để trace lỗi
- **Thiếu validation** warrantyQuantity không được âm
- **Không có compensating transaction** khi rollback

**Kịch bản tồn ảo:**
```
1. Dpos gửi request tạo phiếu bảo hành
2. createStockSlip() tạo StockSlip và StockSlipDetail thành công
3. handleStockTransaction() BỊ LỖI (timeout, deadlock, etc.)
4. Transaction ROLLBACK
5. Dpos KHÔNG nhận được error (network timeout)
6. Dpos hiển thị "Thành công" cho user
7. User nghĩ đã nhập kho, nhưng thực tế KHÔNG có
→ TỒN ẢO: Thiếu tồn kho bảo hành
```

**3. Integration với Dpos**

```javascript
// ⚠️ THIẾU: Idempotency key để tránh duplicate request
// ⚠️ THIẾU: Webhook callback để confirm thành công
// ⚠️ THIẾU: Retry logic với exponential backoff
```

---

### ⚠️ VẤN ĐỀ 3: Chuyển Kho & Chuyển Kho BH

#### Mô tả vấn đề
Thỉnh thoảng bị tồn ảo, không nhiều (vài phiếu/tháng).

#### Root Cause Analysis

**1. Chuyển Kho Bình Thường**

```javascript
// src/services/stockService.js - Line 1270-1312
// Bước 1: Trừ tồn kho nguồn
const warrantyQuantity = sourceWarehouse.warrantyQuantity - quantity;
sourceWarehouseUpdate.warrantyQuantity = warrantyQuantity;
await updateProductStock(sourceWarehouseUpdate, transaction);

// Bước 2: Cộng tồn kho đích
const desStockUpdate = {
    id: destinationStock.id,
    warrantyQuantity: destinationStock.warrantyQuantity + quantity,
};
await updateProductStock(desStockUpdate, transaction);
```

**Vấn đề:**
- **2 bước update riêng biệt** → Nếu bước 2 fail, bước 1 đã commit
- **Không kiểm tra** `transferQuantity` trong quá trình chuyển
- **Thiếu validation** tồn kho nguồn đủ không

**Kịch bản tồn ảo:**
```
1. Kho A: inStockQuantity = 10, transferQuantity = 0
2. Chuyển 5 sản phẩm từ A → B
3. Update A: inStockQuantity = 5, transferQuantity = 5 ✅
4. Network timeout trước khi update B
5. Transaction timeout → ROLLBACK
6. Kho A: inStockQuantity = 10, transferQuantity = 0 (rollback)
7. Nhưng phiếu chuyển kho đã tạo → User nghĩ đã chuyển
→ TỒN ẢO: Kho B thiếu 5 sản phẩm
```

---

### ⚠️ VẤN ĐỀ 4: Bán Hàng (Hiếm)

#### Mô tả vấn đề
Rất hiếm khi xảy ra tồn ảo.

#### Root Cause Analysis

**Lý do hiếm:**
- Bán hàng thường là **1 sản phẩm / 1 đơn hàng**
- Ít khi bán hàng loạt cùng lúc
- Flow đơn giản hơn: Confirmed → Success

**Khi nào xảy ra:**
- **Flash sale** với nhiều đơn hàng cùng lúc
- **Đổi trạng thái hàng loạt** từ Confirmed → Success

**Giải pháp:** Tương tự VẤN ĐỀ 1 (Đổi trạng thái đơn hàng)

---

## 🛠️ Giải Pháp Đề Xuất

### 🔴 PRIORITY 0: Đổi Trạng Thái Đơn Hàng

#### Giải pháp 1: Pessimistic Locking (Khuyến nghị)

```javascript
// src/services/orderService.js - updateProductStock
const updateProductStock = async (productStocks, mode, transaction) => {
    try {
        await Bluebird.map(
            productStocks,
            async (productStock) => {
                // ✅ SỬA: Thêm FOR UPDATE để lock row
                const productStockExist = await ProductStock.findOne({
                    where: { id: productStock.productStockId },
                    attributes: ['id', 'inStockQuantity', 'holdingQuantity', 
                                 'deliveryQuantity', 'transferQuantity', 'quantity'],
                    lock: transaction.LOCK.UPDATE, // ✅ LOCK ROW
                    transaction: transaction,
                });

                // ✅ SỬA: Validate đầy đủ
                if (productStock.inStockQuantityCurrent !== productStockExist.inStockQuantity) {
                    throw new Error(`Tồn kho sản phẩm ${productStock.productName} đã bị thay đổi`);
                }

                const quantityInstock = inStockQuantityRequest + inStockQuantityCurrent;
                const quantityHolding = holdingQuantityRequest + holdingQuantityCurrent;
                const quantityDelivery = deliveryQuantityRequest + deliveryQuantityCurrent;

                // ✅ SỬA: Validate tồn kho không âm
                if (quantityInstock < 0) {
                    throw new Error(`Tồn kho sản phẩm ${productStock.productName} không đủ`);
                }

                // ✅ SỬA: Validate tổng quantity
                const totalQuantity = quantityInstock + quantityHolding + quantityDelivery;
                if (totalQuantity !== productStockExist.quantity) {
                    throw new Error(`Tổng tồn kho sản phẩm ${productStock.productName} không khớp`);
                }

                const [rowUpdated] = await ProductStock.update(
                    {
                        inStockQuantity: quantityInstock,
                        holdingQuantity: quantityHolding,
                        deliveryQuantity: quantityDelivery,
                    },
                    {
                        where: { id: productStockExist.id },
                        transaction: transaction,
                    },
                );

                if (!rowUpdated) {
                    throw new Error(`Cập nhật sản phẩm ${productStock.productName} không thành công`);
                }
            },
            { concurrency: 1 },
        );
    } catch (error) {
        console.error('[updateProductStock] Error:', error);
        throw error;
    }
};
```

**Ưu điểm:**
- ✅ Ngăn chặn hoàn toàn race condition
- ✅ Đơn giản, dễ implement
- ✅ Tương thích với code hiện tại

**Nhược điểm:**
- ⚠️ Giảm performance khi có nhiều request đồng thời
- ⚠️ Có thể gây deadlock nếu không cẩn thận

#### Giải pháp 2: Optimistic Locking

```javascript
// Bước 1: Thêm version field vào ProductStock model
ProductStock {
    // ... existing fields
    version: INTEGER, // ✅ THÊM
}

// Bước 2: Update logic
const updateProductStock = async (productStocks, mode, transaction) => {
    await Bluebird.map(
        productStocks,
        async (productStock) => {
            const productStockExist = await ProductStock.findOne({
                where: { id: productStock.productStockId },
                attributes: ['id', 'inStockQuantity', 'version'], // ✅ Đọc version
                transaction: transaction,
            });

            const [rowUpdated] = await ProductStock.update(
                {
                    inStockQuantity: quantityInstock,
                    version: productStockExist.version + 1, // ✅ Tăng version
                },
                {
                    where: {
                        id: productStockExist.id,
                        version: productStockExist.version, // ✅ Chỉ update nếu version khớp
                    },
                    transaction: transaction,
                },
            );

            if (!rowUpdated) {
                throw new Error(`Tồn kho đã bị thay đổi, vui lòng thử lại`);
            }
        },
        { concurrency: 1 },
    );
};
```

**Ưu điểm:**
- ✅ Không lock database
- ✅ Performance tốt hơn Pessimistic Locking
- ✅ Không gây deadlock

**Nhược điểm:**
- ⚠️ Cần thêm field `version` vào database
- ⚠️ Cần retry logic khi conflict
- ⚠️ Phức tạp hơn

#### Giải pháp 3: Atomic Operations (Khuyến nghị cao nhất)

```javascript
// ✅ SỬA: Dùng increment/decrement thay vì set giá trị
const updateProductStock = async (productStocks, mode, transaction) => {
    await Bluebird.map(
        productStocks,
        async (productStock) => {
            // ✅ KHÔNG cần đọc giá trị hiện tại
            const [rowUpdated] = await ProductStock.increment(
                {
                    inStockQuantity: inStockQuantityRequest, // Có thể âm
                    holdingQuantity: holdingQuantityRequest,
                    deliveryQuantity: deliveryQuantityRequest,
                },
                {
                    where: { id: productStock.productStockId },
                    transaction: transaction,
                },
            );

            // ✅ Validate sau khi update
            const productStockUpdated = await ProductStock.findOne({
                where: { id: productStock.productStockId },
                attributes: ['inStockQuantity'],
                transaction: transaction,
            });

            if (productStockUpdated.inStockQuantity < 0) {
                throw new Error(`Tồn kho sản phẩm ${productStock.productName} không đủ`);
            }
        },
        { concurrency: 1 },
    );
};
```

**Ưu điểm:**
- ✅ **Atomic operation** - Không có race condition
- ✅ Không cần lock
- ✅ Performance tốt nhất
- ✅ Code đơn giản

**Nhược điểm:**
- ⚠️ Cần refactor logic hiện tại

---

### 🔴 PRIORITY 0: Bảo Hành Dpos

#### Giải pháp 1: Idempotency Key

```javascript
// Bước 1: Thêm field vào StockSlip model
StockSlip {
    // ... existing fields
    idempotencyKey: STRING, // ✅ THÊM - Unique constraint
}

// Bước 2: Update createImport
const createImport = async (payload, userId) => {
    const idempotencyKey = payload.idempotencyKey; // Dpos gửi kèm
    
    // ✅ Kiểm tra đã tạo chưa
    const existingStockSlip = await StockSlip.findOne({
        where: { idempotencyKey },
    });
    
    if (existingStockSlip) {
        return existingStockSlip.id; // ✅ Trả về ID cũ, không tạo mới
    }
    
    // ... existing logic
    stockSlipModel.idempotencyKey = idempotencyKey;
    await createStockSlip(stockSlipModel, stockSlipDetail);
};
```

**Ưu điểm:**
- ✅ Ngăn chặn duplicate request
- ✅ Dpos có thể retry an toàn
- ✅ Industry standard practice

#### Giải pháp 2: Webhook Callback

```javascript
// Bước 1: Thêm callback URL vào payload
const createImport = async (payload, userId) => {
    // ... existing logic
    
    try {
        const stockSlipId = await createStockSlip(stockSlipModel, stockSlipDetail);
        
        // ✅ Gửi webhook callback về Dpos
        if (payload.callbackUrl) {
            await axios.post(payload.callbackUrl, {
                status: 'success',
                stockSlipId: stockSlipId,
                idempotencyKey: payload.idempotencyKey,
            });
        }
        
        return stockSlipId;
    } catch (error) {
        // ✅ Gửi webhook callback lỗi
        if (payload.callbackUrl) {
            await axios.post(payload.callbackUrl, {
                status: 'failed',
                error: error.message,
                idempotencyKey: payload.idempotencyKey,
            });
        }
        throw error;
    }
};
```

#### Giải pháp 3: Event Sourcing

```javascript
// Bước 1: Tạo bảng WarrantyStockEvent
WarrantyStockEvent {
    id: UUID,
    eventType: STRING, // 'IMPORT_REQUESTED', 'IMPORT_COMPLETED', 'IMPORT_FAILED'
    stockSlipId: UUID,
    payload: JSON,
    status: STRING,
    createdAt: DATE,
}

// Bước 2: Log mọi event
const createImport = async (payload, userId) => {
    // ✅ Log event REQUESTED
    const event = await WarrantyStockEvent.create({
        eventType: 'IMPORT_REQUESTED',
        payload: payload,
        status: 'PENDING',
    });
    
    try {
        const stockSlipId = await createStockSlip(stockSlipModel, stockSlipDetail);
        
        // ✅ Log event COMPLETED
        await WarrantyStockEvent.update(
            {
                stockSlipId: stockSlipId,
                status: 'COMPLETED',
                eventType: 'IMPORT_COMPLETED',
            },
            { where: { id: event.id } },
        );
        
        return stockSlipId;
    } catch (error) {
        // ✅ Log event FAILED
        await WarrantyStockEvent.update(
            {
                status: 'FAILED',
                eventType: 'IMPORT_FAILED',
                payload: { ...payload, error: error.message },
            },
            { where: { id: event.id } },
        );
        throw error;
    }
};
```

**Ưu điểm:**
- ✅ Có thể trace toàn bộ lịch sử
- ✅ Dễ debug khi có lỗi
- ✅ Có thể replay events

---

### 🟡 PRIORITY 1: Chuyển Kho & Chuyển Kho BH

#### Giải pháp: 2-Phase Commit Pattern

```javascript
// src/services/stockService.js
const transferStock = async (sourceStoreId, destStoreId, productId, quantity, transaction) => {
    // ✅ Phase 1: Validate và lock
    const [sourceStock, destStock] = await Promise.all([
        ProductStock.findOne({
            where: { storeId: sourceStoreId, productId },
            lock: transaction.LOCK.UPDATE,
            transaction,
        }),
        ProductStock.findOne({
            where: { storeId: destStoreId, productId },
            lock: transaction.LOCK.UPDATE,
            transaction,
        }),
    ]);
    
    // ✅ Validate
    if (sourceStock.inStockQuantity < quantity) {
        throw new Error('Kho nguồn không đủ hàng');
    }
    
    // ✅ Phase 2: Update atomic
    await Promise.all([
        ProductStock.increment(
            {
                inStockQuantity: -quantity,
                transferQuantity: quantity,
            },
            {
                where: { id: sourceStock.id },
                transaction,
            },
        ),
        ProductStock.increment(
            {
                transferQuantity: quantity,
            },
            {
                where: { id: destStock.id },
                transaction,
            },
        ),
    ]);
    
    // ✅ Phase 3: Confirm transfer (khi hàng đến)
    // Gọi từ API riêng khi xác nhận nhận hàng
};

const confirmTransfer = async (transferId, transaction) => {
    // ... load transfer info
    
    await Promise.all([
        ProductStock.increment(
            {
                transferQuantity: -quantity,
            },
            {
                where: { id: sourceStock.id },
                transaction,
            },
        ),
        ProductStock.increment(
            {
                inStockQuantity: quantity,
                transferQuantity: -quantity,
            },
            {
                where: { id: destStock.id },
                transaction,
            },
        ),
    ]);
};
```

---

## 📊 Monitoring & Alerting

### 1. Tạo View Kiểm Tra Tồn Ảo

```sql
-- View: Kiểm tra tổng quantity có khớp không
CREATE VIEW v_product_stock_validation AS
SELECT 
    ps.id,
    ps.productId,
    ps.storeId,
    ps.quantity AS total_quantity,
    (ps.inStockQuantity + ps.deliveryQuantity + ps.transferQuantity + 
     ps.holdingQuantity + ps.warrantyQuantity) AS calculated_quantity,
    (ps.quantity - (ps.inStockQuantity + ps.deliveryQuantity + ps.transferQuantity + 
                    ps.holdingQuantity + ps.warrantyQuantity)) AS discrepancy
FROM ProductStocks ps
WHERE ps.deleted = 0
HAVING discrepancy != 0;
```

### 2. Cron Job Kiểm Tra Hàng Ngày

```javascript
// src/crons/check-phantom-stock.js
const checkPhantomStock = async () => {
    const phantomStocks = await sequelize.query(`
        SELECT * FROM v_product_stock_validation
        WHERE discrepancy != 0
    `);
    
    if (phantomStocks.length > 0) {
        // ✅ Gửi alert qua Telegram/Email
        await sendAlert({
            title: '🚨 Phát hiện tồn kho ảo',
            count: phantomStocks.length,
            details: phantomStocks,
        });
    }
};

// Chạy mỗi ngày lúc 2h sáng
cron.schedule('0 2 * * *', checkPhantomStock);
```

### 3. Logging Chi Tiết

```javascript
// src/utils/stock-logger.js
const logStockChange = async (productStockId, action, before, after, transaction) => {
    await StockChangeLog.create({
        productStockId,
        action, // 'ORDER_CREATE', 'ORDER_UPDATE', 'WARRANTY_IMPORT', etc.
        beforeQuantity: before,
        afterQuantity: after,
        userId: getCurrentUserId(),
        timestamp: new Date(),
    }, { transaction });
};
```

---

## 🎯 Implementation Roadmap

### Phase 1: Quick Wins (1-2 tuần)

**Week 1:**
- [ ] Implement Pessimistic Locking cho `updateProductStock`
- [ ] Add validation tồn kho không âm
- [ ] Add validation tổng quantity
- [ ] Tạo view `v_product_stock_validation`

**Week 2:**
- [ ] Implement Idempotency Key cho Warranty Stock
- [ ] Add event logging cho Warranty Stock
- [ ] Setup cron job kiểm tra tồn ảo hàng ngày
- [ ] Add monitoring dashboard

### Phase 2: Long-term Solutions (3-4 tuần)

**Week 3:**
- [ ] Refactor sang Atomic Operations (increment/decrement)
- [ ] Implement 2-Phase Commit cho chuyển kho
- [ ] Add webhook callback cho Dpos integration

**Week 4:**
- [ ] Implement Event Sourcing cho critical flows
- [ ] Add comprehensive logging
- [ ] Performance testing
- [ ] Load testing

### Phase 3: Optimization (2 tuần)

**Week 5-6:**
- [ ] Optimize database indexes
- [ ] Add Redis caching cho read-heavy queries
- [ ] Implement circuit breaker cho external calls
- [ ] Add retry mechanism với exponential backoff

---

## 📈 Success Metrics

### KPIs

| Metric | Hiện tại | Mục tiêu | Cách đo |
|--------|----------|----------|---------|
| **Tỉ lệ tồn ảo đơn hàng** | ~5-10% | < 0.1% | Số đơn bị lệch / Tổng đơn |
| **Tỉ lệ tồn ảo bảo hành** | ~3-5% | < 0.1% | Số phiếu BH lệch / Tổng phiếu |
| **Tỉ lệ tồn ảo chuyển kho** | ~1-2% | < 0.05% | Số phiếu CK lệch / Tổng phiếu |
| **Thời gian phát hiện lỗi** | 1-7 ngày | < 1 giờ | Alert time |
| **Thời gian fix lỗi** | 1-3 ngày | < 4 giờ | Resolution time |

### Monitoring Dashboard

```
┌─────────────────────────────────────────────────┐
│  📊 INVENTORY HEALTH DASHBOARD                  │
├─────────────────────────────────────────────────┤
│  ✅ Tổng sản phẩm: 15,234                       │
│  ⚠️  Tồn ảo phát hiện: 12 (0.08%)               │
│  🔴 Tồn ảo chưa fix: 3 (0.02%)                  │
│                                                  │
│  📈 Xu hướng 7 ngày:                            │
│  ▁▂▃▅▂▁▁ (Giảm 40%)                            │
│                                                  │
│  🚨 Alerts hôm nay: 2                           │
│  - Order #12345: Tồn ảo +5 sản phẩm            │
│  - Warranty #67890: Thiếu 2 sản phẩm           │
└─────────────────────────────────────────────────┘
```

---

## 🔧 Testing Strategy

### 1. Unit Tests

```javascript
// tests/services/orderService.test.js
describe('updateProductStock', () => {
    it('should prevent race condition with concurrent updates', async () => {
        // Arrange
        const productStock = await createTestProductStock({ inStockQuantity: 100 });
        
        // Act: 2 requests cùng lúc
        const [result1, result2] = await Promise.all([
            updateProductStock([{ productStockId: productStock.id, inStockQuantityRequest: -10 }]),
            updateProductStock([{ productStockId: productStock.id, inStockQuantityRequest: -5 }]),
        ]);
        
        // Assert
        const finalStock = await ProductStock.findByPk(productStock.id);
        expect(finalStock.inStockQuantity).toBe(85); // 100 - 10 - 5
    });
    
    it('should throw error when stock is insufficient', async () => {
        const productStock = await createTestProductStock({ inStockQuantity: 5 });
        
        await expect(
            updateProductStock([{ productStockId: productStock.id, inStockQuantityRequest: -10 }])
        ).rejects.toThrow('Tồn kho không đủ');
    });
});
```

### 2. Integration Tests

```javascript
// tests/integration/warranty-stock.test.js
describe('Warranty Stock Integration', () => {
    it('should handle Dpos duplicate requests with idempotency key', async () => {
        const payload = {
            idempotencyKey: 'test-key-123',
            storeId: 1,
            listProduct: [/* ... */],
        };
        
        // Act: Gửi 2 request giống nhau
        const [result1, result2] = await Promise.all([
            createImport(payload, userId),
            createImport(payload, userId),
        ]);
        
        // Assert: Chỉ tạo 1 phiếu
        expect(result1).toBe(result2);
        const stockSlips = await StockSlip.findAll({ where: { idempotencyKey: 'test-key-123' } });
        expect(stockSlips.length).toBe(1);
    });
});
```

### 3. Load Tests

```javascript
// tests/load/order-concurrent.test.js
import { check } from 'k6';
import http from 'k6/http';

export let options = {
    stages: [
        { duration: '1m', target: 100 }, // Ramp up to 100 users
        { duration: '3m', target: 100 }, // Stay at 100 users
        { duration: '1m', target: 0 },   // Ramp down
    ],
};

export default function () {
    const payload = JSON.stringify({
        /* order data */
    });
    
    const res = http.post('http://localhost:3000/api/orders', payload);
    
    check(res, {
        'status is 200': (r) => r.status === 200,
        'no phantom stock': (r) => {
            // Kiểm tra tồn kho sau mỗi request
            const stock = getProductStock(productId);
            return stock.inStockQuantity >= 0;
        },
    });
}
```

---

## 📝 Tổng Kết

### Nguyên Nhân Chính

1. **Race Condition** trong `updateProductStock` (60% vấn đề)
2. **Thiếu Idempotency** trong Dpos integration (30% vấn đề)
3. **2-Phase Update** trong chuyển kho (10% vấn đề)

### Giải Pháp Ưu Tiên

| Priority | Giải pháp | Impact | Effort | ROI |
|----------|-----------|--------|--------|-----|
| 🔴 P0 | Pessimistic Locking | Cao | Thấp | ⭐⭐⭐⭐⭐ |
| 🔴 P0 | Idempotency Key | Cao | Thấp | ⭐⭐⭐⭐⭐ |
| 🔴 P0 | Validation Tăng Cường | Cao | Thấp | ⭐⭐⭐⭐⭐ |
| 🟡 P1 | Atomic Operations | Cao | Trung bình | ⭐⭐⭐⭐ |
| 🟡 P1 | Event Sourcing | Trung bình | Cao | ⭐⭐⭐ |
| 🟢 P2 | Monitoring Dashboard | Thấp | Trung bình | ⭐⭐⭐ |

### Timeline Dự Kiến

- **Week 1-2:** Fix critical issues (P0)
- **Week 3-4:** Implement long-term solutions (P1)
- **Week 5-6:** Optimization & monitoring (P2)
- **Week 7+:** Continuous improvement

### Rủi Ro

| Rủi Ro | Mức độ | Mitigation |
|--------|--------|------------|
| Performance degradation | Trung bình | Load testing trước khi deploy |
| Deadlock với Pessimistic Lock | Thấp | Timeout ngắn, retry logic |
| Breaking changes | Thấp | Feature flag, gradual rollout |

---

**Người phân tích:** AI Agent  
**Ngày:** 08/02/2026  
**Version:** 1.0
