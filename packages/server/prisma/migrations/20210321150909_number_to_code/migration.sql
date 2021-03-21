/*
  Warnings:

  - You are about to drop the column `number` on the `Department` table. All the data in the column will be lost.
  - Added the required column `code` to the `Department` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Department" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME NOT NULL
);
INSERT INTO "new_Department" ("id", "name", "slug", "createdAt", "updateAt") SELECT "id", "name", "slug", "createdAt", "updateAt" FROM "Department";
DROP TABLE "Department";
ALTER TABLE "new_Department" RENAME TO "Department";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
