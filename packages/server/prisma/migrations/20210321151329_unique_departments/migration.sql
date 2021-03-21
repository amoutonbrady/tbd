/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[name]` on the table `Department`. If there are existing duplicate values, the migration will fail.
  - The migration will add a unique constraint covering the columns `[slug]` on the table `Department`. If there are existing duplicate values, the migration will fail.
  - The migration will add a unique constraint covering the columns `[code]` on the table `Department`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Department.name_unique" ON "Department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Department.slug_unique" ON "Department"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Department.code_unique" ON "Department"("code");
