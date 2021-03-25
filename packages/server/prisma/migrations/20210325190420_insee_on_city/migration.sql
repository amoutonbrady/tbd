-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_City" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "zip" TEXT NOT NULL,
    "insee" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME NOT NULL,
    "departmentId" INTEGER NOT NULL,
    FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_City" ("id", "zip", "insee", "name", "slug", "latitude", "longitude", "createdAt", "updateAt", "departmentId") SELECT "id", "zip", "insee", "name", "slug", "latitude", "longitude", "createdAt", "updateAt", "departmentId" FROM "City";
DROP TABLE "City";
ALTER TABLE "new_City" RENAME TO "City";
CREATE UNIQUE INDEX "City.insee_unique" ON "City"("insee");
CREATE UNIQUE INDEX "City.zip_name_unique" ON "City"("zip", "name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
