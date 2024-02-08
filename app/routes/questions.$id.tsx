import { PrismaClient } from "@prisma/client";
import { json } from "@remix-run/node";

export async function loader({ params, request }) {
    // I guess just get the questionnaire ID from the URL
    // Then get a list of questions from that
    const prisma = new PrismaClient()
    const questionnaireId = params.id;
    const responses = await prisma.question.findMany({where: {
      questionnaireid: questionnaireId,
    },
    select: {
      id: true,
      text: true,
      type: true,
      answer: {
        select: {
          id: true,
          text: true,
        }
      }
    }
  });

  return json(responses);
  }