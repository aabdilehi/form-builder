/*
This is for the page in which you create the questionnaire.

There are clear differences between this and the actual questionnaire page such as:
- Though you define the type of the question, you do not need to create the actual inputs for it
- There is no data storage so keep everything in state until submission
- Still need to use a form as the data is spread over many components
*/

import { Form, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { FormInput, TextArea } from "./UI/input";
import { RoundedButton } from "./UI/buttons";
import { useDoubleCheck } from "~/hooks/use-double-check";
import { MdClose, MdOutlineKeyboardArrowDown } from "react-icons/md";

type ResponseOptions = {
  label: string;
  value: any;
};

const ResponseType: { [type: string]: ResponseOptions } = {
  Single: { label: "Single select", value: "single-select" },
  Multi: { label: "Multi select", value: "multi-select" },
  Range: { label: "Range", value: "range" },
  Number: { label: "Number", value: "number" },
  Input: { label: "Text input", value: "text" },
};

export const CreateForm = () => {
  const submit = useSubmit();

  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [questions, setQuestions] = useState<any[]>([]);
  const { doubleCheck, getButtonProps } = useDoubleCheck();

  useEffect(() => {
    console.log(questions);
  }, [questions]);

  return (
    <Form
      className="flex flex-col items-center gap-2"
      method="post"
      onSubmit={(e) => {
        e.preventDefault();
        submit(
          { title, description, questions },
          { method: "POST", encType: "application/json" }
        );
      }}
    >
      <div className="w-4/5 sm:w-1/2">
        <FormInput
          type="text"
          name="title"
          className="sm:!w-2/3 !mx-auto"
          placeholder="Title"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          value={title}
        />
        <TextArea
          name="description"
          placeholder="Description goes here"
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          value={description}
        />
      </div>
      {questions.map((question, qIndex) => (
        <div className="mx-auto my-2 text-center w-[95dvw] sm:w-2/3 p-4 rounded-md container bg-indigo-50 ring-1 ring-inset ring-indigo-200/50">
          <div>
            <Question
              question={question}
              setQuestion={(data) => {
                const qs = [
                  ...questions.slice(0, qIndex),
                  data,
                  ...questions.slice(qIndex + 1),
                ];
                setQuestions(qs);
              }}
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        className="w-1/3 sm:w-32 mx-auto active:scale-95 transition transition-all duration-150 flex h-10 items-center justify-center rounded-md font-medium text-white bg-indigo-400/50 hover:bg-indigo-400"
        onClick={() => {
          const qs = [
            ...questions,
            {
              title: "New question",
              type: "single-select",
              options: [],
              maxSelect: -1,
            },
          ];
          setQuestions(qs);
        }}
      >
        Add Question
      </button>
      <button
        {...getButtonProps({
          type: "submit",
          className: `w-1/3 sm:w-32 mx-auto active:scale-95 transition transition-all duration-150 flex h-10 items-center justify-center rounded-md font-medium text-white ${
            doubleCheck
              ? "bg-red-500 hover:bg-red-700"
              : "bg-indigo-500 hover:bg-indigo-400"
          }`,
        })}
      >
        {doubleCheck ? "Confirm" : "Create"}
      </button>
    </Form>
  );
};

const Question = ({
  setQuestion,
  question,
}: {
  setQuestion: (data: any) => void;
  question: any;
}) => {
  const [data, setData] = useState(question);

  useEffect(() => {
    if (question.type !== data.type) {
      switch (data.type) {
        case "text":
          const textData = {
            title: data.title,
            type: data.type,
            longForm: data.longForm ?? false,
            maxChars: data.maxChars ?? null,
          };
          setData(textData);
          break;
        case "number":
          let numberData = {
            title: data.title,
            type: data.type,
            min: data.min ?? 0,
            max: data.max ?? 5,
          };
          setData(numberData);
          break;
        case "range":
          let rangeData = {
            title: data.title,
            type: data.type,
            min: data.min ?? 0,
            max: data.max ?? 5,
            step: data.step ?? 1,
          };
          setData(rangeData);
          break;
        case "single-select":
        case "multi-select":
          let multiSelectData = {
            title: data.title,
            type: data.type,
            options: data.options ?? [],
            maxSelect: data.maxSelect ?? null,
          };
          setData(multiSelectData);
          break;
        default:
          break;
      }
    }
    setQuestion(data);
  }, [data]);

  const getType = () => {
    switch (data.type) {
      case "text":
        return (
          <TextInput
            longForm={data.longForm}
            setLongForm={(value) => {
              const q = { ...data, longForm: value };
              setData(q);
            }}
            maxChars={data.maxChars}
            setMaxChars={(value) => {
              const q = { ...data, maxChars: value };
              setData(q);
            }}
          />
        );
      case "single-select":
      case "multi-select":
        return (
          <MultipleChoice
            type={data.type}
            max={data.maxSelect}
            setMax={(value) => {
              const q = { ...data, maxSelect: value };
              setData(q);
            }}
            options={data.options}
            addOption={() => {
              const q = { ...data, options: [...data.options, undefined] };
              setData(q);
            }}
            setOption={(value, index) => {
              const q = {
                ...data,
                options: [
                  ...data.options.slice(0, index),
                  value,
                  ...data.options.slice(index + 1),
                ],
              };
              setData(q);
            }}
            removeOption={(index) => {
              const q = {
                ...data,
                maxSelect:
                  data.maxSelect > data.options.length - 1
                    ? data.options.length - 1
                    : data.maxSelect,
                options: [
                  ...data.options.slice(0, index),
                  ...data.options.slice(index + 1),
                ],
              };
              setData(q);
            }}
          />
        );
      case "range":
      case "number":
        return (
          <NumberInput
            range={data.type == "range"}
            min={data.min}
            max={data.max}
            step={data.step}
            setMin={(value) => {
              const q = { ...data, min: value };
              setData(q);
            }}
            setMax={(value) => {
              const q = { ...data, max: value };
              setData(q);
            }}
            setStep={(value) => {
              const q = { ...data, step: value };
              setData(q);
            }}
          />
        );
      default:
        return;
    }
  };

  return (
    <div className="w-full mx-auto flex flex-col justify-center items-center">
      <div className="w-full">
        <FormInput
          type="text"
          placeholder="Question"
          value={data.title}
          onChange={(e) => {
            const q = { ...data, title: e.target.value };
            setData(q);
          }}
          required
        />
      </div>
      <div className="w-fit relative">
        <select
          className="appearance-none p-2 pr-10 m-2 ring-1 ring-inset rounded-md bg-white ring-gray-300 focus:ring-2 focus:ring-indigo-400/50 outline-none"
          onChange={(e) => {
            const q = { ...data, type: e.target.value };
            setData(q);
          }}
          value={data.type}
        >
          {Object.keys(ResponseType).map((type: string) => {
            return (
              <option value={ResponseType[type].value}>
                {ResponseType[type].label}
              </option>
            );
          })}
        </select>

        <MdOutlineKeyboardArrowDown className="pointer-events-none absolute translate-x-1/2 right-7 top-1/2 -translate-y-1/2 text-2xl" />
      </div>
      {getType()}
    </div>
  );
};

const TextInput = ({
  longForm,
  maxChars,
  setLongForm,
  setMaxChars,
}: {
  longForm: boolean;
  maxChars: number | undefined;
  setLongForm: (value: boolean) => void;
  setMaxChars: (value: number | undefined) => void;
}) => {
  const [limitChars, setLimitChars] = useState(false);
  return (
    <div className="w-full flex flex-col gap-2 w-max">
      <div className="flex flex-row items-center justify-center">
        <label className="text-slate-700 ring-gray-100/50 bg-white/30 has-[:checked]:ring-indigo-200  has-[:checked]:text-indigo-600 has-[:checked]:bg-white/30 grid text-left grid-cols-[1fr_auto] items-center gap-6 rounded-lg p-2 ring-1 ring-gray-300 hover:bg-white w-full has-[:disabled]:bg-gray-300/50 has-[:disabled]:text-gray-400 ">
          Long form answer?
          <input
            className="box-content h-1.5 w-1.5 appearance-none rounded-md border-[5px] border-white bg-white bg-clip-padding outline-none ring-1 ring-gray-950/10 checked:border-indigo-500 checked:ring-indigo-500"
            type="checkbox"
            checked={longForm}
            onChange={() => setLongForm(!longForm)}
          />
        </label>
      </div>
      <div className="flex flex-row w-full mx-auto items-center justify-center">
        <label className="text-slate-700 ring-gray-100/50 bg-white/30 has-[:checked]:ring-indigo-200  has-[:checked]:text-indigo-600 has-[:checked]:bg-white/30 grid text-left grid-cols-[1fr_auto] items-center gap-6 rounded-lg p-2 ring-1 ring-gray-300 hover:bg-white min-w-fit w-full has-[:disabled]:bg-gray-300/50 has-[:disabled]:text-gray-400 ">
          Character Limit?
          <input
            className="box-content h-1.5 w-1.5 appearance-none rounded-md border-[5px] border-white bg-white bg-clip-padding outline-none ring-1 ring-gray-950/10 checked:border-indigo-500 checked:ring-indigo-500"
            type="checkbox"
            checked={limitChars}
            onChange={() => setLimitChars(!limitChars)}
          />
        </label>
      </div>
      {limitChars && (
        <div className="w-[6rem] mx-auto my-2">
          <FormInput
            type="number"
            label="Limit"
            className=""
            value={maxChars}
            onChange={(e) =>
              setMaxChars(limitChars ? Number(e.target.value) : undefined)
            }
          />
        </div>
      )}
    </div>
  );
};

// Single select or multi select
// Could merge the two and then programattically infer the type based on "choose up to n" or "max" value.
// Already have a checkbox that disables all unselected options after reaching a set limit
const MultipleChoice = ({
  type,
  options,
  max,
  addOption,
  setOption,
  removeOption,
  setMax,
}: {
  type: ResponseType;
  options: any[];
  max: number | undefined;
  addOption: () => void;
  setOption: (value: string, index: number) => void;
  removeOption: (index: number) => void;
  setMax: (value: number | undefined) => void;
}) => {
  const [limitSelection, setLimitSelection] = useState(false);
  return (
    <>
      {/* Choose up to N answers */}
      {type == ResponseType.Multi.value && (
        <div className="w-full">
          <div className="flex flex-row items-center justify-center">
            <label className="text-slate-700 ring-gray-100/50 bg-white/30 has-[:checked]:ring-indigo-200  has-[:checked]:text-indigo-600 has-[:checked]:bg-white/30 grid text-left grid-cols-[1fr_auto] items-center gap-6 rounded-lg p-2 ring-1 ring-gray-300 hover:bg-white w-fit sm:w-fit mx-auto has-[:disabled]:bg-gray-300/50 has-[:disabled]:text-gray-400 ">
              Set Limit?
              <input
                className="box-content h-1.5 w-1.5 appearance-none rounded-md border-[5px] border-white bg-white bg-clip-padding outline-none ring-1 ring-gray-950/10 checked:border-indigo-500 checked:ring-indigo-500"
                type="checkbox"
                checked={limitSelection}
                onChange={() => setLimitSelection(!limitSelection)}
              />
            </label>
          </div>
          {limitSelection && (
            <div className="w-[6rem] mx-auto my-2">
              <FormInput
                type="number"
                label="Limit"
                value={
                  limitSelection
                    ? Math.min(options.length, Math.max(0, Number(max)))
                    : undefined
                }
                onChange={(e) =>
                  setMax(
                    limitSelection
                      ? Math.min(
                          options.length,
                          Math.max(0, Number(e.target.value))
                        )
                      : undefined
                  )
                }
              />
            </div>
          )}
        </div>
      )}
      <div className="w-full flex flex-col mx-auto items-center justify-center">
        {options?.map((option, oIndex) => (
          <Option
            option={option}
            setOption={(value) => setOption(value, oIndex)}
            removeOption={() => removeOption(oIndex)}
          />
        ))}
      </div>
      <div className="w-full">
        <button
          type="button"
          className="w-1/3 sm:w-fit px-2 mt-2 mx-auto active:scale-95 transition transition-all duration-150 flex h-10 items-center justify-center rounded-md text-white bg-indigo-400/50 hover:bg-indigo-400"
          disabled={
            type == ResponseType.Input.value || type == ResponseType.Range.value
          }
          onClick={addOption}
        >
          Add Option
        </button>
      </div>
    </>
  );
};

// Range or Number
const NumberInput = ({
  range = false,
  min,
  max,
  step,
  setMin,
  setMax,
  setStep,
}: {
  range?: boolean;
  min: number;
  max: number;
  step?: number;
  setMin: (value: number) => void;
  setMax: (value: number) => void;
  setStep?: (value: number) => void;
}) => {
  return (
    <div
      className={`grid ${
        range ? "grid-cols-3" : "grid-cols-2"
      } w-1/4 min-w-64 flex flex-row items-center justify-center gap-2`}
    >
      <FormInput
        type="number"
        label="Min"
        max={max}
        value={String(min)}
        onChange={(e) => setMin(Number(e.target.value))}
      />
      {range && (
        <FormInput
          type="number"
          label="Step"
          min={0.1}
          step={0.1}
          max={max - min}
          value={step}
          onChange={(e) => setStep(Number(e.target.value))}
        />
      )}
      <FormInput
        type="number"
        min={min}
        label="Max"
        value={String(max)}
        onChange={(e) => setMax(Number(e.target.value))}
      />
    </div>
  );
};

const Option = ({
  option,
  setOption,
  removeOption,
}: {
  option: string;
  setOption: (o: string) => void;
  removeOption: () => void;
}) => {
  return (
    <div className="mt-2  flex flex-row justify-center items-center">
      <FormInput
        className="w-full sm:1/3 mt-0"
        type="text"
        placeholder="Option goes here"
        value={option}
        onChange={(e) => setOption(e.target.value)}
        required
      />
      <button
        type="button"
        className="w-[2.4rem] ml-1 mx-auto active:scale-95 transition transition-all duration-150 flex h-[2.2rem] items-center justify-center rounded-md font-medium text-white bg-indigo-500 hover:bg-indigo-400"
        onClick={removeOption}
      >
        <MdClose className="mx-auto text-xl mt-[2px]" />
      </button>
    </div>
  );
};
