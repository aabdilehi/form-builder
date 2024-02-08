/*
  Warnings:

  - You are about to drop the `answer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `questionnaire` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `questionnaire_status` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `response` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `response_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `visibility` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "answer";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "question";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "questionnaire";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "questionnaire_status";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "response";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "response_types";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "visibility";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Questionnaire" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visibility" TEXT NOT NULL DEFAULT 'public',
    "status" TEXT NOT NULL DEFAULT 'open',
    "responseType" TEXT NOT NULL DEFAULT 'anyone',
    CONSTRAINT "Questionnaire_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Questionnaire_responseType_fkey" FOREIGN KEY ("responseType") REFERENCES "ResponseTypes" ("value") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Questionnaire_status_fkey" FOREIGN KEY ("status") REFERENCES "QuestionnaireStatus" ("value") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Questionnaire_visibility_fkey" FOREIGN KEY ("visibility") REFERENCES "Visibility" ("value") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QuestionnaireStatus" (
    "value" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "questionnaireId" TEXT NOT NULL,
    CONSTRAINT "Question_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "Questionnaire" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TextInputQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionId" TEXT NOT NULL,
    "longForm" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "TextInputQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MultipleChoiceQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionId" TEXT NOT NULL,
    CONSTRAINT "MultipleChoiceQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RangeInputQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionId" TEXT NOT NULL,
    "min" INTEGER NOT NULL DEFAULT 0,
    "max" INTEGER NOT NULL DEFAULT 5,
    "steps" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "RangeInputQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NumberInputQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionId" TEXT NOT NULL,
    "min" INTEGER NOT NULL DEFAULT 0,
    "max" INTEGER NOT NULL DEFAULT 5,
    CONSTRAINT "NumberInputQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "multipleChoiceQuestionId" TEXT NOT NULL,
    CONSTRAINT "Answer_multipleChoiceQuestionId_fkey" FOREIGN KEY ("multipleChoiceQuestionId") REFERENCES "MultipleChoiceQuestion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Response" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answerId" TEXT,
    "text" TEXT,
    CONSTRAINT "Response_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Response_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ResponseTypes" (
    "value" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Visibility" (
    "value" TEXT NOT NULL PRIMARY KEY
);

-- CreateIndex
CREATE UNIQUE INDEX "TextInputQuestion_questionId_key" ON "TextInputQuestion"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "MultipleChoiceQuestion_questionId_key" ON "MultipleChoiceQuestion"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "RangeInputQuestion_questionId_key" ON "RangeInputQuestion"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "NumberInputQuestion_questionId_key" ON "NumberInputQuestion"("questionId");
