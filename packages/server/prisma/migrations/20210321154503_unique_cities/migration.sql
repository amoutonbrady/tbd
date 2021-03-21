/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[zip,name]` on the table `City`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "City.zip_name_unique" ON "City"("zip", "name");
