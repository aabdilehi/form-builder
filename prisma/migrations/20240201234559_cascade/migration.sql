-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionnaireid" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "questionorder" INTEGER NOT NULL,
    CONSTRAINT "question_questionnaireid_fkey" FOREIGN KEY ("questionnaireid") REFERENCES "questionnaire" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_question" ("id", "questionnaireid", "questionorder", "text", "type") SELECT "id", "questionnaireid", "questionorder", "text", "type" FROM "question";
DROP TABLE "question";
ALTER TABLE "new_question" RENAME TO "question";
CREATE TABLE "new_response" (
    "id" TEXT NOT NULL,
    "answerid" TEXT NOT NULL,
    "response" TEXT,

    PRIMARY KEY ("id", "answerid"),
    CONSTRAINT "response_answerid_fkey" FOREIGN KEY ("answerid") REFERENCES "answer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_response" ("answerid", "id", "response") SELECT "answerid", "id", "response" FROM "response";
DROP TABLE "response";
ALTER TABLE "new_response" RENAME TO "response";
CREATE TABLE "new_answer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionid" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    CONSTRAINT "answer_questionid_fkey" FOREIGN KEY ("questionid") REFERENCES "question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_answer" ("id", "questionid", "text") SELECT "id", "questionid", "text" FROM "answer";
DROP TABLE "answer";
ALTER TABLE "new_answer" RENAME TO "answer";
CREATE TABLE "new_questionnaire" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "userid" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visibility" TEXT NOT NULL DEFAULT 'public',
    "status" TEXT NOT NULL DEFAULT 'open',
    "response_type" TEXT NOT NULL DEFAULT 'anyone',
    CONSTRAINT "questionnaire_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "questionnaire_response_type_fkey" FOREIGN KEY ("response_type") REFERENCES "response_types" ("value") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "questionnaire_status_fkey" FOREIGN KEY ("status") REFERENCES "questionnaire_status" ("status") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "questionnaire_visibility_fkey" FOREIGN KEY ("visibility") REFERENCES "visibility" ("value") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_questionnaire" ("date", "description", "id", "response_type", "status", "title", "userid", "visibility") SELECT "date", "description", "id", "response_type", "status", "title", "userid", "visibility" FROM "questionnaire";
DROP TABLE "questionnaire";
ALTER TABLE "new_questionnaire" RENAME TO "questionnaire";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
