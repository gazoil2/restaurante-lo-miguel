/*
  Warnings:

  - You are about to drop the column `dishState` on the `Dish` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `DishState` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[category]` on the table `FoodCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[state]` on the table `OrderState` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[state]` on the table `TableState` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dishStateId` to the `Dish` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Dish" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "dishStateId" INTEGER NOT NULL,
    CONSTRAINT "Dish_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "FoodCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Dish_dishStateId_fkey" FOREIGN KEY ("dishStateId") REFERENCES "DishState" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Dish" ("categoryId", "desc", "id", "name", "price") SELECT "categoryId", "desc", "id", "name", "price" FROM "Dish";
DROP TABLE "Dish";
ALTER TABLE "new_Dish" RENAME TO "Dish";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "DishState_name_key" ON "DishState"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FoodCategory_category_key" ON "FoodCategory"("category");

-- CreateIndex
CREATE UNIQUE INDEX "OrderState_state_key" ON "OrderState"("state");

-- CreateIndex
CREATE UNIQUE INDEX "TableState_state_key" ON "TableState"("state");
