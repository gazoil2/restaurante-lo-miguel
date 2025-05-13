-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrderHeader" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "orderStateId" INTEGER NOT NULL,
    "orderAddressId" INTEGER NOT NULL,
    "total" REAL,
    "discount" REAL NOT NULL DEFAULT 0.0,
    CONSTRAINT "OrderHeader_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderHeader_orderStateId_fkey" FOREIGN KEY ("orderStateId") REFERENCES "OrderState" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderHeader_orderAddressId_fkey" FOREIGN KEY ("orderAddressId") REFERENCES "Address" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrderHeader" ("discount", "id", "orderAddressId", "orderStateId", "total", "userId") SELECT "discount", "id", "orderAddressId", "orderStateId", "total", "userId" FROM "OrderHeader";
DROP TABLE "OrderHeader";
ALTER TABLE "new_OrderHeader" RENAME TO "OrderHeader";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
