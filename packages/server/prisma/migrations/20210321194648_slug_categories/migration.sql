/*
  Warnings:

  - Added the required column `slug` to the `RatingCategory` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RatingCategory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME NOT NULL
);
INSERT INTO "new_RatingCategory" ("id", "name", "createdAt", "updateAt") SELECT "id", "name", "createdAt", "updateAt" FROM "RatingCategory";
DROP TABLE "RatingCategory";
ALTER TABLE "new_RatingCategory" RENAME TO "RatingCategory";
CREATE UNIQUE INDEX "RatingCategory.name_unique" ON "RatingCategory"("name");
CREATE UNIQUE INDEX "RatingCategory.slug_unique" ON "RatingCategory"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
