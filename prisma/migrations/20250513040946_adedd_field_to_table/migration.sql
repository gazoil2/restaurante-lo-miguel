/*
  Warnings:

  - Added the required column `size` to the `TableState` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TableState" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "state" TEXT NOT NULL,
    "size" INTEGER NOT NULL
);
INSERT INTO "new_TableState" ("id", "state") SELECT "id", "state" FROM "TableState";
DROP TABLE "TableState";
ALTER TABLE "new_TableState" RENAME TO "TableState";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
