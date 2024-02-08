/*
  Warnings:

  - You are about to drop the `FakeTable` table. If the table is not empty, all the data it contains will be lost.
  - You are about to alter the column `max` on the `NumberInputQuestion` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `min` on the `NumberInputQuestion` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `max` on the `RangeInputQuestion` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `min` on the `RangeInputQuestion` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `steps` on the `RangeInputQuestion` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- AlterTable
ALTER TABLE "Response" ADD COLUMN "number" REAL;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "FakeTable";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_NumberInputQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionId" TEXT NOT NULL,
    "min" REAL DEFAULT 0,
    "max" REAL DEFAULT 5,
    CONSTRAINT "NumberInputQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_NumberInputQuestion" ("id", "max", "min", "questionId") SELECT "id", "max", "min", "questionId" FROM "NumberInputQuestion";
DROP TABLE "NumberInputQuestion";
ALTER TABLE "new_NumberInputQuestion" RENAME TO "NumberInputQuestion";
CREATE UNIQUE INDEX "NumberInputQuestion_questionId_key" ON "NumberInputQuestion"("questionId");
CREATE TABLE "new_RangeInputQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionId" TEXT NOT NULL,
    "min" REAL DEFAULT 0,
    "max" REAL DEFAULT 5,
    "steps" REAL DEFAULT 1,
    CONSTRAINT "RangeInputQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_RangeInputQuestion" ("id", "max", "min", "questionId", "steps") SELECT "id", "max", "min", "questionId", "steps" FROM "RangeInputQuestion";
DROP TABLE "RangeInputQuestion";
ALTER TABLE "new_RangeInputQuestion" RENAME TO "RangeInputQuestion";
CREATE UNIQUE INDEX "RangeInputQuestion_questionId_key" ON "RangeInputQuestion"("questionId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
