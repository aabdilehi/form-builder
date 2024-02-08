import { PrismaClient } from "@prisma/client";
import {
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Chart,
  Legend,
  Title,
  Tooltip,
  scales,
} from "chart.js/auto";
import { Bar, Line, Pie } from "react-chartjs-2";
import Carousel from "~/components/UI/carousel";
import { filterCookie } from "~/cookies.server";

Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

export async function loader({ params, request }: LoaderFunctionArgs) {
  const prisma = new PrismaClient();

  const questionnaire = await prisma.questionnaire.findUnique({
    where: {
      id: params.id,
    },
    select: {
      id: true,
      title: true,
      questions: {
        select: {
          text: true,
          type: true,
          responses: true,
          multipleChoice: {
            select: {
              answers: true,
            },
          },
          textInput: true,
          rangeInput: true,
          numberInput: true,
        },
      },
    },
  });

  function parseResponses({
    text,
    type,
    responses,
    ...question
  }: {
    text: string;
    type: string;
    responses?: any[];
  }) {
    // For multiple choice answers, map id to text
    const answerIdToText = {};
    if (type == "multi-select" || type == "single-select") {
      question.multipleChoice.answers.forEach(
        ({ id, text }: { id: string; text: string }) =>
          (answerIdToText[id] = text)
      );
    }

    let result = type == "multi-select" || type == "single-select" ? {} : [];
    responses?.forEach(({ answerId, ...response }: { answerId: string }) => {
      switch (type) {
        case "single-select":
        case "multi-select":
          // Count responses to each answer
          const answerText = answerIdToText[answerId];
          if (!Object.hasOwn(result, answerId)) {
            result[answerText] = 1;
          } else {
            result[answerText] += 1;
          }
          break;
        case "text":
          result.push(response.text);
          break;
        case "number":
        case "range":
          result.push(response.number);
        default:
          break;
      }
    });
    return result;
  }
  const formattedResponse = {};
  questionnaire.questions.forEach(
    (question) => (formattedResponse[question.text] = parseResponses(question))
  );

  return json({ questionnaire, formattedResponse });
}

export const meta: MetaFunction = ({ data }: { data: any }) => {
  return [{ title: `Viewing responses for "${data.questionnaire.title}"` }];
};

export default function Response() {
  const { questionnaire, formattedResponse } = useLoaderData<typeof loader>();
  return (
    <>
      <p className="text-3xl m-2 text-center">
        <span className="font-semibold">Responses: </span>
        {questionnaire.title}
      </p>
      <div className="flex flex-row">
        {/* <DemoList /> */}
        <div className="flex flex-col flex-auto w-4/5">
          {questionnaire?.questions.map((question, index) => (
            <div className="mx-auto my-2 space-y-2 text-center w-[95dvw] sm:w-2/3 p-4 rounded-md container bg-indigo-50 ring-1 ring-inset ring-indigo-200/50">
              <p className="text-2xl font-semibold">{question.text}</p>
              <p>No. responses: {question.responses.length}</p>
              {question.type == "text" && (
                <div>
                  <Carousel
                    items={formattedResponse[question.text]}
                    renderItem={(item) => (
                      <div className="bg-white p-4 rounded-md shadow-inner ring-1 ring-gray-200">
                        <p
                          className={
                            question.textInput?.longForm
                              ? "text-left min-h-[4rem]"
                              : "text-center"
                          }
                        >
                          {item}
                        </p>
                      </div>
                    )}
                  />
                </div>
              )}
              {(question.type == "range" || question.type == "number") && (
                <div className="w- full mx-auto bg-white shadow-inner rounded-md ring-1 ring-gray-200">
                  <Line
                    data={{
                      labels: [-100, 0, 100],
                      datasets: [
                        {
                          label: "Sales",
                          data:
                            Object.values(formattedResponse[question.text]) ??
                            [],
                          fill: true,
                          backgroundColor: "rgba(99, 101, 241, 0.4)",
                          pointBorderColor: "rgb(99, 101, 241)",
                          pointBackgroundColor: "rgb(99, 101, 241)",
                          pointHoverBorderColor: "rgba(225,225,225,0.9)",
                          pointRadius: 5,
                          pointBorderWidth: 2,
                          borderWidth: 3,
                          borderColor: "rgb(99, 101, 241)",
                          tension: 0.4,
                        },
                      ],
                    }}
                    options={{
                      // Change the font family and size to match your website
                      font: {
                        family: "Inter, sans-serif",
                        size: 14,
                      },
                      // Remove the grid lines and ticks
                      scales: {
                        x: {
                          grid: {
                            display: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                        y: {
                          grid: {
                            display: true,
                          },
                          ticks: {
                            display: true,
                          },
                          min:
                            question.rangeInput?.min ??
                            question.numberInput?.min ??
                            undefined,
                          max:
                            question.rangeInput?.max ??
                            question.numberInput?.max ??
                            undefined,
                        },
                      },
                      // Add some padding around the chart
                      layout: {
                        padding: 20,
                      },
                      // Disable the legend
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                    }}
                  />
                </div>
              )}
              {(question.type == "single-select" ||
                question.type == "multi-select") && (
                <div className="w-1/3 mx-auto">
                  <Pie
                    options={{
                      maintainAspectRatio: false,
                      responsive: true,
                    }}
                    data={{
                      labels: Object.keys(formattedResponse[question.text]),
                      datasets: [
                        {
                          label: question.text,
                          data: Object.values(formattedResponse[question.text]),
                          backgroundColor: [
                            "rgba(255, 99, 132, 0.2)",
                            "rgba(54, 162, 235, 0.2)",
                            "rgba(255, 206, 86, 0.2)",
                            "rgba(75, 192, 192, 0.2)",
                            "rgba(153, 102, 255, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                          ],
                          borderColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 192, 192, 1)",
                            "rgba(153, 102, 255, 1)",
                            "rgba(255, 159, 64, 1)",
                          ],
                          borderWidth: 1,
                        },
                      ],
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export async function action({ request }) {
  const data = await request.formData();
  const filter = data.get("filter");

  const pathname = new URL(request.url).pathname;

  return redirect(request.url, {
    headers: {
      "Set-Cookie": await filterCookie.serialize(JSON.parse(filter), {
        path: pathname,
      }),
    },
  });
}
