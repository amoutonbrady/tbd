-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RatingCategory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME NOT NULL
);
INSERT INTO "new_RatingCategory" ("id", "name", "slug", "createdAt", "updateAt", "description") SELECT "id", "name", "slug", "createdAt", "updateAt", coalesce("description", '') AS "description" FROM "RatingCategory";
DROP TABLE "RatingCategory";
ALTER TABLE "new_RatingCategory" RENAME TO "RatingCategory";
CREATE UNIQUE INDEX "RatingCategory.name_unique" ON "RatingCategory"("name");
CREATE UNIQUE INDEX "RatingCategory.slug_unique" ON "RatingCategory"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
