import { PrismaClient } from "@prisma/client";
import {
  ActionFunction,
  ActionFunctionArgs,
  LoaderFunction,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { uuid } from "uuidv4";
import { CreateForm } from "~/components/creator";
import { authenticator } from "~/modules/auth/auth.server";

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  return null;
};

export const meta: MetaFunction = () => {
  return [{ title: "Creator" }];
};

export default () => {
  return <CreateForm />;
};

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const id = uuid();
  const prisma = new PrismaClient();
  // push to database then redirect to questionnaire
  const { title, description, questions } = await request.json();

  const typeParse = (
    type: string,
    options: any[],
    longForm?: boolean,
    min?: number,
    max?: number,
    maxSelect?: number,
    maxChars?: number,
    steps?: number
  ) => {
    switch (type) {
      case "single-select":
      case "multi-select":
        return {
          multipleChoice: {
            create: {
              id: uuid(),
              maxSelect,
              answers: {
                create: options.map((text) => ({ id: uuid(), text })),
              },
            },
          },
        };
      case "text":
        return {
          textInput: {
            create: {
              id: uuid(),
              longForm,
              maxChars,
            },
          },
        };
      case "range":
        return {
          rangeInput: {
            create: {
              id: uuid(),
              min,
              max,
              steps,
            },
          },
        };
      case "number":
        return {
          numberInput: {
            create: {
              id: uuid(),
              min,
              max,
            },
          },
        };
      default:
        return;
    }
  };
  // no need for transaction as prisma client apparently ensures they either all succeed or none

  try {
    await prisma.questionnaire.create({
      data: {
        id,
        title,
        description,
        userId: session.id,
        questions: {
          create: questions.map(
            (
              {
                title,
                type,
                options,
                longForm,
                min,
                max,
                maxChars,
                maxSelect,
                step,
              }: {
                title: string;
                type: string;
                options: any[];
                longForm?: boolean;
                min?: number;
                max?: number;
                maxChars?: number;
                maxSelect?: number;
                step?: number;
              },
              index: number
            ) => {
              const questionId = uuid();
              return {
                id: questionId,
                type,
                order: index + 1,
                text: title,
                ...typeParse(
                  type,
                  options,
                  longForm,
                  min,
                  max,
                  maxSelect,
                  maxChars,
                  step
                ),
              };
            }
          ),
        },
      },
    });
    return redirect(`/q/${id}`);
  } catch (error) {
    throw new Response("Oh no! Something went wrong!", {
      status: 500,
    });
  }
};
