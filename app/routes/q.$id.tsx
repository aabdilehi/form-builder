import {
  ActionFunction,
  ActionFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import { useLoaderData, Link, Form, useSubmit } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
import { uuid } from "uuidv4";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { authenticator } from "~/modules/auth/auth.server";
import { TextArea, TextInput } from "~/components/UI/input";
import { Tooltip } from "~/components/UI/icon-tooltip";
import { TbMaximize, TbMinimize } from "react-icons/tb";
import { useDoubleCheck } from "~/hooks/use-double-check";
import Carousel from "~/components/UI/carousel";

const CustomRadioGroup = ({
  items,
  labelStyling,
  checkboxStyling,
  onChange,
  disabled,
}: {
  items: Array<{ id: string; text: string }>;
  checkboxStyling?: string | undefined;
  labelStyling?: string | undefined;
  onChange: (answerId: string) => void;
  disabled: boolean;
}) => {
  const [checkedIndex, setCheckedIndex] = useState(0);

  useEffect(() => {
    onChange(items[checkedIndex].id);
  }, [checkedIndex]);

  const renderItem = (
    id: string,
    item: { id: string; text: string },
    index: number
  ) => {
    return (
      <label
        htmlFor={item.id}
        className="text-slate-700 my-2 has-[:checked]:ring-indigo-200 has-[:checked]:text-indigo-600 has-[:checked]:bg-indigo-50 grid text-left grid-cols-[1fr_auto] items-center gap-6 rounded-lg p-4 ring-1 ring-transparent hover:bg-slate-100 w-full sm:w-1/3 mx-auto has-[:disabled]:bg-gray-300/50 has-[:disabled]:text-gray-400"
      >
        {item.text}
        <input
          className="box-content h-1.5 w-1.5 appearance-none rounded-full border-[5px] border-white bg-white bg-clip-padding outline-none ring-1 ring-gray-950/10 checked:border-indigo-500 checked:ring-indigo-500"
          name={id}
          id={item.id}
          type="radio"
          value={item.text}
          onChange={() => {
            setCheckedIndex(index);
          }}
          defaultChecked={!disabled && index === 0}
          checked={!disabled && index === checkedIndex}
          disabled={disabled}
        />
      </label>
    );
  };

  return (
    <div className="flex flex-col">
      {items.map((item, index) => renderItem(item.id, item, index))}
    </div>
  );
};

const CustomCheckbox = ({
  items,
  maxSelected = -1,
  labelStyling,
  checkboxStyling,
  onChange,
  disabled,
}: {
  items: Array<{ id: string; text: string }>;
  checkboxStyling?: string | undefined;
  labelStyling?: string | undefined;
  maxSelected?: number;
  onChange: (values: string[]) => void;
  disabled: boolean;
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    onChange(selectedIds);
  }, [selectedIds]);

  const renderItem = (item: { id: string; text: string }) => {
    return (
      <label
        htmlFor={item.id}
        className="text-slate-700 ring-gray-100/50 bg-gray-500/5 my-2 has-[:checked]:ring-indigo-200  has-[:checked]:text-indigo-600 has-[:checked]:bg-indigo-50 grid text-left grid-cols-[1fr_auto] items-center gap-6 rounded-lg p-4 ring-1 ring-transparent hover:bg-slate-100 w-full sm:w-1/3 mx-auto has-[:disabled]:bg-gray-300/50 has-[:disabled]:text-gray-400 "
      >
        {item.text}
        <input
          className="box-content h-1.5 w-1.5 appearance-none rounded-md border-[5px] border-white bg-white bg-clip-padding outline-none ring-1 ring-gray-950/10 checked:border-indigo-500 checked:ring-indigo-500"
          name={item.id}
          id={item.id}
          type="checkbox"
          onChange={() => {
            const i = selectedIds.indexOf(item.id);
            if (i !== -1) {
              const s = [
                ...selectedIds.slice(0, i),
                ...selectedIds.slice(i + 1),
              ];
              setSelectedIds(s);
            } else {
              if (selectedIds.length > maxSelected && maxSelected > 0) return;
              const s = [...selectedIds, item.id];
              setSelectedIds(s);
            }
          }}
          checked={selectedIds.includes(item.id)}
          disabled={
            disabled ||
            (selectedIds.length >= maxSelected &&
              maxSelected > 0 &&
              !selectedIds.includes(item.id))
          }
          value={item.text}
        />
      </label>
    );
  };

  return (
    <div className="mt-4 space-y-2">
      {items.map((item, index) => renderItem(item, index))}
    </div>
  );
};

const CustomRange = ({
  id,
  min,
  max,
  step,
  onChange,
  disabled,
}: {
  id: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  disabled: boolean;
}) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [toolTipValue, setTooltipValue] = useState();
  const rangeRef = useRef();
  const tooltipRef = useRef();
  // const animationRef = useRef();

  const showToolTip = (visible: boolean) => {
    setTooltipVisible(visible);
  };

  // Event listeners for making tooltip visible
  useLayoutEffect(() => {
    if (!rangeRef.current) return;
    rangeRef.current?.addEventListener(
      "mouseenter",
      showToolTip.bind(this, true)
    );
    rangeRef.current?.addEventListener(
      "mouseleave",
      showToolTip.bind(this, false)
    );
    rangeRef.current?.addEventListener(
      "touchstart",
      showToolTip.bind(this, true)
    );
    rangeRef.current?.addEventListener(
      "touchend",
      showToolTip.bind(this, false)
    );

    setTooltipValue(rangeRef.current.value);

    return () => {
      if (!rangeRef.current) return;
      rangeRef.current?.removeEventListener(
        "mouseenter",
        showToolTip.bind(this, true)
      );
      rangeRef.current?.removeEventListener(
        "mouseleave",
        showToolTip.bind(this, false)
      );
      rangeRef.current?.removeEventListener(
        "touchstart",
        showToolTip.bind(this, true)
      );
      rangeRef.current?.removeEventListener(
        "touchend",
        showToolTip.bind(this, false)
      );
    };
  }, []);

  // Animate tooltip to stick with range slider's "thumb"
  useLayoutEffect(() => {
    const animateToolTipPosition = () => {
      if (!toolTipValue) return;
      if (!tooltipRef.current) return;

      const percentValue =
        ((toolTipValue - Number(min)) / (Number(max) - Number(min))) * 100;

      tooltipRef.current.style.left = `${percentValue}%`;
    };

    // "Animation" is only one frame so cancel quickly but not too quickly
    const anim = requestAnimationFrame(animateToolTipPosition);

    setTimeout(() => {
      cancelAnimationFrame(anim);
    }, 100);
  }, [toolTipValue]);

  return (
    <div className="relative w-1/2 mx-auto">
      <input
        ref={rangeRef}
        type="range"
        className={
          "w-full h-4 ring-1 ring-gray-950/10 touch-none focus:ring-indigo-500/50 rounded-lg appearance-none cursor-pointer range-lg [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:box-content [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[2px] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:bg-clip-padding [&::-webkit-slider-thumb]:outline-none [&::-webkit-slider-thumb]:ring-8 " +
          (disabled
            ? "[&::-webkit-slider-thumb]:ring-indigo-500/50"
            : "[&::-webkit-slider-thumb]:ring-indigo-500")
        }
        defaultValue={Math.min(Number(min), 0)}
        min={min}
        max={max}
        step={step}
        list={id}
        disabled={disabled}
        onChange={(e) => {
          setTooltipValue(e.target.value);
          onChange(Number(e.target.value));
        }}
      />
      {/* Tooltip */}
      {!disabled && tooltipVisible && (
        <Tooltip
          ref={tooltipRef}
          text={toolTipValue}
          placement={"custom"}
          position="translate-x-[-50%]"
        />
      )}
      {/* Labels */}
      <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-0 -bottom-4">
        {min}
      </span>
      {Number(min) < 0 && (
        <span
          className={`text-sm text-gray-500 dark:text-gray-400 absolute -translate-x-1/2 start-[${
            ((0 - Number(min)) / (Number(max) - Number(min))) * 100
          }%]
          } rtl:translate-x-1/2 -bottom-4`}
        >
          0
        </span>
      )}
      <span className="text-sm text-gray-500 dark:text-gray-400 absolute end-0 -bottom-4">
        {max}
      </span>
    </div>
  );
};

const renderQuestionByType = (
  type: string,
  question: any,
  maximised: boolean,
  disabled: boolean,
  setResponse: (value: { [key: string]: any }) => void
) => {
  switch (type) {
    case "text":
      return (
        <>
          <p
            className={
              maximised ? "my-4 text-2xl text-center font-semibold" : undefined
            }
          >
            {question.text}
            {question.textInput.maxChars &&
              ` (${question.textInput.maxChars} characters or less)`}
          </p>
          {question.textInput.longForm ? (
            <TextArea
              disabled={disabled}
              name={question.id}
              placeholder="Type answer here"
              maxLength={question.textInput.maxChars}
              onChange={(e) => setResponse({ text: e.target.value })}
            />
          ) : (
            <TextInput
              disabled={disabled}
              type="text"
              name={question.id}
              placeholder="Type answer here"
              className="sm:w-1/2"
              maxLength={question.textInput.maxChars}
              onChange={(e) => setResponse({ text: e.target.value })}
            />
          )}
        </>
      );
    case "range":
      return (
        <>
          <p
            className={
              maximised ? "my-4 text-2xl text-center font-semibold" : undefined
            }
          >
            {question.text}
            {` (Between ${question.rangeInput.min} and ${question.rangeInput.max})`}
          </p>
          <CustomRange
            id={question.id}
            min={question.rangeInput.min}
            max={question.rangeInput.max}
            step={question.rangeInput.steps}
            disabled={disabled}
            onChange={(value: number) => setResponse({ number: Number(value) })}
          />
        </>
      );
    case "number":
      return (
        <>
          <p
            className={
              maximised ? "my-4 text-2xl text-center font-semibold" : undefined
            }
          >
            {question.text}
            {` (Between ${question.numberInput.min} and ${question.numberInput.max})`}
          </p>
          <TextInput
            type="number"
            className="sm:w-[5rem]"
            disabled={disabled}
            name={question.id}
            min={question.numberInput.min}
            max={question.numberInput.max}
            onChange={(e) => setResponse({ number: Number(e.target.value) })}
          />
        </>
      );
    case "single-select":
      return (
        <>
          <p
            className={
              maximised ? "my-4 text-2xl text-center font-semibold" : undefined
            }
          >
            {question.text}
            {` (Choose one)`}
          </p>
          <CustomRadioGroup
            items={question.multipleChoice.answers}
            disabled={disabled}
            onChange={(answerId: string) => setResponse({ answerId })}
          />
        </>
      );
    case "multi-select":
      return (
        <>
          <p
            className={
              maximised ? "my-4 text-2xl text-center font-semibold" : undefined
            }
          >
            {question.text}
            {question.multipleChoice.maxSelect
              ? ` (Choose up to ${question.multipleChoice.maxSelect} options)`
              : ` (Choose as many options as are applicable)`}
          </p>
          <CustomCheckbox
            items={question.multipleChoice.answers}
            maxSelected={question.multipleChoice.maxSelect}
            disabled={disabled}
            onChange={(answerIds: string[]) =>
              setResponse({
                answers: answerIds.map((answerId: string) => ({ answerId })),
              })
            }
          />
        </>
      );
    default:
      return null;
  }
};

const Question = ({
  question,
  maximise,
  maximised = false,
  disabled = false,
  setResponse,
  ...props
}: {
  question: any;
  maximise?: () => void;
  maximised?: boolean;
  setResponse: (questionId: string, data: { [key: string]: any }) => void;
  disabled?: boolean;
}) => {
  return (
    <div
      id={question.id}
      className={`relative rounded-sm w-full ${
        maximised ? "h-full" : "h-max"
      } p-4 mx-auto text-center bg-indigo-50/50 ring-1 ring-indigo-200/50 focus:ring-blue-400/50`}
    >
      {maximised ? null : (
        <button
          className="absolute rounded-md right-1 top-1 w-8 h-8 bg-indigo-400/50 text-white hover:bg-indigo-400 active:bg-white active:text-indigo-200 p-1 m-1"
          type="button"
          onClick={maximise}
        >
          <TbMaximize className="mx-auto" />
        </button>
      )}
      {renderQuestionByType(
        question.type,
        question,
        maximised,
        disabled,
        (value: { [key: string]: any }) =>
          setResponse(question.id, {
            questionId: question.id,
            type: question.type,
            ...value,
          })
      )}
    </div>
  );
};

const Questionnaire = ({
  id,
  title,
  description,
  questions,
  locked,
  closed,
  owner,
}: {
  id: string;
  title: string;
  description: string;
  questions: Array<{
    id: string;
    text: string;
    type: string;
    questionorder: number;
    answer: Array<{ id: string; text: string }>;
  }>;
  locked: boolean;
  closed: boolean;
  owner: boolean;
}) => {
  const [maximised, setMaximised] = useState(false);
  const [focusedQuestion, setFocusedQuestion] = useState(0);
  const [response, setResponse] = useState({});
  const { doubleCheck, getButtonProps } = useDoubleCheck();
  const submit = useSubmit();

  useEffect(() => {
    console.log(response);
  }, [response]);

  return locked || closed ? (
    <div className="h-full mt-2 w-full relative">
      <div className="select-none rounded-md bg-slate-500/50 w-full h-full absolute top-0 left-0 flex items-center justify-center">
        {closed ? (
          <p className="w-full h-[4rem] p-2 bg-light text-center mx-auto text-xl">
            This questionnaire is no longer accepting responses.
          </p>
        ) : (
          <p className="w-full h-[4rem] p-2 bg-light text-center mx-auto text-xl">
            Only registered users can respond to this questionnaire. Please{" "}
            <Link to={"/login"} className="font-semibold">
              sign in
            </Link>{" "}
            or{" "}
            <Link to={"/login"} className="font-semibold">
              register
            </Link>
            .
          </p>
        )}
      </div>
      <div>
        <p className="text-3xl">{title}</p>
        <p className="bg-slate-500 rounded-md ">{description}</p>
      </div>
      {questions.map((question) => (
        <Question
          question={question}
          setResponse={(id, value) => {
            const r = { ...response, [id]: value };
            setResponse(r);
          }}
          maximise={() => {}}
          maximised={false}
          disabled
        />
      ))}
    </div>
  ) : (
    <Form
      method="post"
      id={id}
      className="h-full w-full mx-auto relative"
      onSubmit={(e) => {
        e.preventDefault();
        submit(
          { questionnaireId: id, response },
          { method: "POST", encType: "application/json" }
        );
      }}
    >
      {maximised ? (
        <Carousel
          fullscreen
          items={questions}
          renderItem={(item, index) => (
            <Question
              question={item}
              maximised
              disabled={owner}
              setResponse={(qId, data) => {
                const r = { ...response, [qId]: { ...data } };
                setResponse(r);
              }}
            />
          )}
          startIndex={focusedQuestion}
        >
          <button
            className="absolute rounded-md z-10 right-1 top-1 w-8 h-8 bg-indigo-400/50 text-white hover:bg-indigo-400 active:bg-white active:text-indigo-200 p-1 m-1"
            type="button"
            onClick={() => setMaximised(false)}
          >
            <TbMinimize className="mx-auto" />
          </button>
        </Carousel>
      ) : (
        <div className="space-y-4 w-[80dvw] container mx-auto my-2">
          <div className="space-y-3">
            <p className="text-3xl text-center font-semibold">{title}</p>
            <div className="bg-indigo-50/50 ring-1 ring-indigo-200/50 p-3 rounded-sm">
              <p className="text-lg font-semibold text-center">Description</p>
              {description}
            </div>
          </div>
          {questions.map((question, index) => (
            <Question
              question={question}
              maximise={() => {
                setFocusedQuestion(index);
                setMaximised(true);
              }}
              disabled={owner}
              setResponse={(qId, data) => {
                const r = { ...response, [qId]: { ...data } };
                setResponse(r);
              }}
            />
          ))}
          {owner ? null : (
            <button
              {...getButtonProps({
                type: "submit",
                className: `w-1/3 sm:w-32 mx-auto active:scale-95 transition transition-all duration-150 flex h-10 items-center justify-center rounded-md font-mediums text-white ${
                  doubleCheck
                    ? "bg-red-500 hover:bg-red-700"
                    : "bg-indigo-500 hover:bg-indigo-400"
                }`,
              })}
            >
              {doubleCheck ? "Confirm" : "Submit"}
            </button>
          )}
        </div>
      )}
    </Form>
  );
};

export async function loader({ params, request }) {
  const user = await authenticator.isAuthenticated(request);

  const prisma = new PrismaClient();

  const questionnaire = await prisma.questionnaire.findUnique({
    where: {
      id: params.id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      userId: true,
      responseType: true,
      status: true,
      visibility: true,
      questions: {
        select: {
          id: true,
          text: true,
          type: true,
          order: true,
          textInput: true,
          multipleChoice: {
            select: {
              maxSelect: true,
              answers: true,
            },
          },
          rangeInput: true,
          numberInput: true,
        },
      },
    },
  });

  if (!questionnaire) {
    return redirect("/404");
  }

  const isOwner = questionnaire?.userId === user?.id;
  const isLocked = questionnaire?.responseType == "registered" && !user;
  const isClosed = questionnaire?.status == "closed" && !isOwner;

  if (!isOwner && !isLocked && !isClosed && !!user) {
    // check if user has already responded
  }

  return json({
    questionnaire: {
      id: questionnaire?.id,
      title: questionnaire?.title,
      description: questionnaire?.description,
      questions: questionnaire?.questions,
    },
    isOwner,
    isLocked,
    isClosed,
  });
}

export const meta: MetaFunction = ({ data }: { data: any }) => {
  return [
    { title: data.questionnaire.title },
    { name: "description", content: data.questionnaire.description },
  ];
};

export default () => {
  const { questionnaire, isOwner, isClosed, isLocked } =
    useLoaderData<typeof loader>();
  const { id, title, description, questions } = questionnaire;

  return (
    <div className="h-full w-full">
      <div className="h-full">
        <Questionnaire
          id={id}
          title={title}
          description={description ?? "No description given"}
          questions={questions}
          locked={isLocked}
          closed={isClosed}
          owner={isOwner}
        />
      </div>
    </div>
  );
};

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const prisma = new PrismaClient();
  const session = await authenticator.isAuthenticated(request);
  const sessionId = session?.id ?? uuid();
  const { questionnaireId, response } = await request.json();

  // Very ugly but SQLite does not support createMany
  try {
    await Promise.all(
      Object.values(response).flatMap(
        async ({
          questionId,
          type,
          ...data
        }: {
          questionId: string;
          type: string;
        }) => {
          switch (type) {
            case "single-select":
              await prisma.response.create({
                data: {
                  id: uuid(),
                  sessionId,
                  questionnaireId,
                  questionId,
                  answerId: data.answerId,
                },
              });
              break;
            case "multi-select":
              await Promise.all(
                data.answers?.flatMap(async (answer: { answerId: string }) => {
                  await prisma.response.create({
                    data: {
                      id: uuid(),
                      sessionId,
                      questionnaireId,
                      questionId,
                      answerId: answer.answerId,
                    },
                  });
                })
              );
              break;
            case "text":
              await prisma.response.create({
                data: {
                  id: uuid(),
                  sessionId,
                  questionnaireId,
                  questionId,
                  text: data.text,
                },
              });
              break;
            case "number":
            case "range":
              await prisma.response.create({
                data: {
                  id: uuid(),
                  sessionId,
                  questionnaireId,
                  questionId,
                  number: data.number,
                },
              });
              break;
          }
        }
      )
    );
    return redirect("/");
  } catch (error) {
    throw new Error("Something went wrong with submitting your response.");
  }
};
