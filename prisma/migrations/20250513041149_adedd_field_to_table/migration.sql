/*
  Warnings:

  - You are about to drop the column `size` on the `TableState` table. All the data in the column will be lost.
  - Added the required column `size` to the `Table` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Table" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tableStateId" INTEGER NOT NULL,
    "size" INTEGER NOT NULL,
    CONSTRAINT "Table_tableStateId_fkey" FOREIGN KEY ("tableStateId") REFERENCES "TableState" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Table" ("id", "tableStateId") SELECT "id", "tableStateId" FROM "Table";
DROP TABLE "Table";
ALTER TABLE "new_Table" RENAME TO "Table";
CREATE TABLE "new_TableState" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "state" TEXT NOT NULL
);
INSERT INTO "new_TableState" ("id", "state") SELECT "id", "state" FROM "TableState";
DROP TABLE "TableState";
ALTER TABLE "new_TableState" RENAME TO "TableState";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
