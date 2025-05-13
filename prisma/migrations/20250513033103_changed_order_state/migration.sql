/*
  Warnings:

  - You are about to drop the column `name` on the `OrderState` table. All the data in the column will be lost.
  - Added the required column `state` to the `OrderState` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrderState" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "state" TEXT NOT NULL
);
INSERT INTO "new_OrderState" ("id") SELECT "id" FROM "OrderState";
DROP TABLE "OrderState";
ALTER TABLE "new_OrderState" RENAME TO "OrderState";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
