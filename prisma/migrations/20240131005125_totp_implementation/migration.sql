-- CreateTable
CREATE TABLE "answer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionid" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    CONSTRAINT "answer_questionid_fkey" FOREIGN KEY ("questionid") REFERENCES "question" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionnaireid" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "questionorder" INTEGER NOT NULL,
    CONSTRAINT "question_questionnaireid_fkey" FOREIGN KEY ("questionnaireid") REFERENCES "questionnaire" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "questionnaire" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "userid" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visibility" TEXT NOT NULL DEFAULT 'public',
    "status" TEXT NOT NULL DEFAULT 'open',
    "response_type" TEXT NOT NULL DEFAULT 'anyone',
    CONSTRAINT "questionnaire_response_type_fkey" FOREIGN KEY ("response_type") REFERENCES "response_types" ("value") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "questionnaire_status_fkey" FOREIGN KEY ("status") REFERENCES "questionnaire_status" ("status") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "questionnaire_visibility_fkey" FOREIGN KEY ("visibility") REFERENCES "visibility" ("value") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "questionnaire_status" (
    "status" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "response" (
    "id" TEXT NOT NULL,
    "answerid" TEXT NOT NULL,
    "response" TEXT,

    PRIMARY KEY ("id", "answerid"),
    CONSTRAINT "response_answerid_fkey" FOREIGN KEY ("answerid") REFERENCES "answer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "response_types" (
    "value" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "visibility" (
    "value" TEXT NOT NULL PRIMARY KEY
);
