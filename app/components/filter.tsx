import { useFetcher } from "@remix-run/react";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CircleSecondaryButton, RoundedSecondaryButton } from "./UI/buttons";
import { QuestionSelect, getAnswerType } from "./questionFilter";
import { loader } from "~/routes/questions.$id";
import { filterCookie } from "~/cookies.server";

// NEED TO UPDATE TO NEW SCHEMA
// OR BETTER YET, COME UP WITH A BETTER SOLUTION OR SCRAP THE FEATURE ENTIRELY

export const DemoList = () => {
  // Initialise demo list from localStorage
  // Should use either permanent storage (preferred) or cookies so I can have a unique filter list for each $id URL parameter
  const [demos, setDemos] = useState(undefined);
  const ref = useRef();
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);

  // synchronize initially
  useLayoutEffect(() => {
    const localDemos = JSON.parse(window.localStorage.getItem("demos"));

    setDemos(!!localDemos ? localDemos : []);
    console.log(localDemos);
  }, []);

  useLayoutEffect(() => {
    if (!ref.current) return;
    if (open) {
      ref.current?.classList?.remove("w-0", "overflow-y-hidden");
      ref.current?.classList?.add("w-full", "p-4", "overflow-y-auto");
    } else {
      ref.current?.classList?.remove("w-full", "p-4", "overflow-y-auto");
      ref.current?.classList?.add("w-0", "overflow-y-hidden");
    }
  }, [open]);

  // synchronize on change
  useEffect(() => {
    if (!demos) return;
    window.localStorage.setItem("demos", JSON.stringify(demos));
  }, [demos]);

  return (
    <>
      <div
        ref={ref}
        className={
          "origin-left transition-all duration-200 w-full ease bg-slate-200 h-[100dvh] flex flex-col"
        }
      >
        <p className="text-center text-2xl font-semibold py-1">Filter list</p>
        {!demos ? null : editingIndex !== -1 ? (
          <DemoEditor
            localTitle={demos[editingIndex].title}
            localData={demos[editingIndex].data}
            updateData={(demo) => {
              const a = [
                ...demos.slice(0, editingIndex),
                demo,
                ...demos.slice(editingIndex + 1),
              ];
              console.log(demo);

              setDemos(a);
            }}
            endEdit={() => setEditingIndex(-1)}
          />
        ) : (
          <>
            {demos.map(({ title, data, formattedData }, index) => (
              <DemoListItem
                index={index}
                title={title}
                data={data}
                formattedData={formattedData}
                edit={() => setEditingIndex(index)}
              />
            ))}{" "}
            <RoundedSecondaryButton
              type="button"
              onClick={() => {
                const a = [
                  ...demos,
                  { title: "New demo", data: [], formattedData: {} },
                ];
                setDemos(a);
              }}
            >
              New filter
            </RoundedSecondaryButton>
          </>
        )}
      </div>
      <button className="absolute left-1" onClick={() => setOpen(!open)}>
        Show/Hide
      </button>
    </>
  );
};

/// Submit button should also end edit, should be able to delete sections, should be able to delete demos

const DemoListItem = ({
  index,
  title,
  data,
  formattedData,
  edit,
}: {
  index: number;
  title: string;
  data: any;
  formattedData: any;
  edit: () => void;
}) => {
  const fetcher = useFetcher({ key: "filter" });

  const selectDemo = () => {
    console.log(formattedData);
    fetcher.submit(
      { filter: JSON.stringify(formattedData) },
      { method: "POST" }
    );
  };

  return (
    <div className="m-1 bg-slate-400/20 w-full mx-auto rounded-md flex flex-row items-center px-2">
      <p className="p-2 w-1/2 flex-auto">{title}</p>
      <div className="w-1/2 flex-auto flex flex-row">
        <RoundedSecondaryButton type="button" onClick={selectDemo}>
          Select
        </RoundedSecondaryButton>
        <RoundedSecondaryButton type="button" onClick={edit}>
          Edit
        </RoundedSecondaryButton>
      </div>
    </div>
  );
};

const DemoEditor = ({
  localTitle,
  localData,
  endEdit,
  updateData,
}: {
  localTitle: string;
  localData: Array<any>;
  endEdit: () => void;
  updateData: (o: any) => void;
}) => {
  const [title, setTitle] = useState(localTitle);
  const [data, setData] = useState(localData);
  const [formattedData, setFormattedData] = useState({ AND: [], OR: [] });
  const [editingIndex, setEditingIndex] = useState(-1);

  const fetcher = useFetcher<typeof loader>({ key: "question-fetcher" });
  const questions = fetcher.data ?? [];

  useEffect(() => {
    fetcher.load("/questions/d52f5894-a3c5-41a7-a53b-e4dafcaa6f17");
  }, []);

  useEffect(() => {
    if (!data) return;
    if (data.length <= 0) return;
    const a = [...data];
    console.log(a);

    const populateByType = (data) => {
      switch (data.question.type) {
        case "text":
          return {
            id: questions[data.question.index].answer[0].id,
            type: "text",
            contains: data.values[0] ?? "",
          };
        case "single-select":
        case "multi-select":
          return {
            type: data.question.type,
            AND: data.operator == "AND" ? data.values : [],
            OR: data.operator == "OR" ? data.values : [],
          };
        default:
          return {};
      }
    };

    try {
      // item template
      let temp = { initial: undefined, AND: [], OR: [] };
      const result = a.reduce((acc, curr) => {
        if (!temp.initial) {
          temp.initial = {
            ...populateByType(curr),
            outerOperator: curr.outerOperator,
          };
        } else {
          // push to temp array
          temp[curr.outerOperator] = [
            ...temp[curr.outerOperator],
            populateByType(curr),
          ];
        }
        if (curr.divided) {
          acc.push(temp);
          temp = { initial: undefined, AND: [], OR: [] };
        }
        return acc;
      }, []);

      // push any lingering data to result (assuming it does not end on a divider)
      if (!!temp.initial) result.push(temp);

      if (result.length === 1) {
        setFormattedData(result[0]);
      } else {
        // ONE MORE LOOP BUT NOW PUT THE FIRST RESULT IN INITIAL AND USE OUTER OPERATOR TO PLACE THE REST
        let final = { initial: undefined, AND: [], OR: [] };
        result.forEach((item) => {
          if (!final.initial) {
            final = item;
          } else {
            final[item.initial.outerOperator].push(item);
          }
        });
        // Set formatted data
        setFormattedData(final);
      }
    } catch (error) {
      console.log(error);
    }
  }, [data]);

  return (
    <div className="flex flex-col mx-auto p-4">
      <button type="button" onClick={endEdit}>
        Back
      </button>
      <div className="mx-auto flex flex-row items-center">
        <input
          className="mx-1 my-2 w-full bg-white/50 rounded-md px-2 py-1 border-2.5 border-slate-400/40"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        {data.map(
          ({ question, operator, outerOperator, values, divided }, index) => (
            <Filter
              qData={questions}
              index={index}
              canDivide={!divided}
              editing={editingIndex === index}
              question={question}
              operator={operator}
              outerOperator={outerOperator}
              values={values}
              divide={() => {
                if (divided) return;
                const a = [
                  ...data.slice(0, index),
                  { ...data[index], divided: true },
                  ...data.slice(index + 1, data.length),
                ];
                setData(a);
              }}
              undivide={() => {
                if (!divided) return;
                const a = [
                  ...data.slice(0, index),
                  { ...data[index], divided: false },
                  ...data.slice(index + 1, data.length),
                ];
                setData(a);
              }}
              edit={() => {
                setEditingIndex(index);
              }}
              endEdit={() => {
                setEditingIndex(-1);
              }}
              setQuestion={(text, type, qIndex) => {
                const a = [
                  ...data.slice(0, index),
                  {
                    ...data[index],
                    values: type == "text" ? [] : data[index].values,
                    question: { text, type, index: qIndex },
                  },
                  ...data.slice(index + 1, data.length),
                ];
                setData(a);
              }}
              setOperator={(o) => {
                const a = [
                  ...data.slice(0, index),
                  { ...data[index], operator: o },
                  ...data.slice(index + 1, data.length),
                ];
                setData(a);
              }}
              setOuterOperator={(o) => {
                const a = [
                  ...data.slice(0, index),
                  { ...data[index], outerOperator: o },
                  ...data.slice(index + 1, data.length),
                ];
                setData(a);
              }}
              setValues={(o) => {
                const a = [
                  ...data.slice(0, index),
                  { ...data[index], values: o },
                  ...data.slice(index + 1, data.length),
                ];
                setData(a);
              }}
            />
          )
        )}
      </div>
      <button
        type="button"
        onClick={() => {
          const a = [
            ...data,
            {
              operator: "AND",
              outerOperator: "AND",
              divided: false,
              values: [],
            },
          ];
          setData(a);
        }}
      >
        Add filter group
      </button>
      <button
        type="button"
        onClick={() => updateData({ title, data, formattedData })}
      >
        Submit
      </button>
    </div>
  );
};

// Divider comes AFTER, therefore divider prop is in the one BEFORE the divider
// I guess treat dividers all as one big filter, e.g. Apple OR Grape AND Pear becomes Apple OR (Grape AND Pear), so {AND: [Grape, Pear], OR: [Apple]} becomes {AND: [], OR: [Apple, {AND: [Grape, Pear]}]}
// The flow goes: evaluate each individual filter, evaluate divided groups, evaluate top level
// Really, all this comes down to is evaluating the data bottom up through iteration
// Outer AND/OR (just gonna call it "outerOperator") comes after (same as divider), but will not be visible if last in array
// Assume AND at first

const Filter = ({
  index,
  editing,
  edit,
  endEdit,
  canDivide,
  divide,
  undivide,
  qData,
  question,
  setQuestion,
  operator,
  setOperator,
  outerOperator,
  setOuterOperator,
  values,
  setValues,
}: {
  qData: Array<any>;
  index: number;
  editing: boolean;
  edit: () => void;
  endEdit: () => void;
  canDivide: boolean;
  divide: () => void;
  undivide: () => void;
  values: Array<string>;
  question: { text: string; index: number; type: string };
  setQuestion: (text: string, type: string, index: number) => void;
  operator: string;
  setOperator: (operator: string) => void;
  outerOperator: string;
  setOuterOperator: (operator: string) => void;
  setValues: (values: Array<string>) => void;
}) => {
  const editingUI = (
    <div className="bg-slate-400/20 flex flex-col w-96 mx-auto rounded-md">
      <OperatorSwitch
        name={"opp" + index}
        value={operator}
        handleChange={(value) => setOperator(value)}
      />
      <div className="flex items-center flex-col w-80 mx-auto rounded-md">
        <div className="mx-auto flex flex-row items-center">
          <QuestionSelect
            data={qData}
            question={question}
            setQuestion={setQuestion}
          />
        </div>
        {!question
          ? null
          : getAnswerType(
              qData[question.index]?.answer,
              question.type,
              values,
              (value, oIndex) => {
                const a = [
                  ...values.slice(0, oIndex),
                  value,
                  ...values.slice(oIndex + 1, values.length),
                ];
                setValues(a);
              }
            )}

        <RoundedSecondaryButton
          type="button"
          onClick={() => {
            const a = [...values, undefined];
            setValues(a);
          }}
        >
          Add filter
        </RoundedSecondaryButton>
      </div>
      <RoundedSecondaryButton type="button" onClick={endEdit}>
        Save
      </RoundedSecondaryButton>
    </div>
  );
  const previewUI = (
    <div className="bg-slate-400/20 flex flex-col w-2/5 mx-auto rounded-md text-center">
      <p className="text-2xl">{question?.text}</p>
      <p className="text-lg">{operator}</p>
      {values?.map((value) => (
        <p className="text-md">{value}</p>
      ))}
      <button type="button" onClick={edit}>
        Edit
      </button>
    </div>
  );
  // Should not be able to add divider on last in array (both pointless and can needlessly complicate data heirarchy)
  return (
    <div className="flex flex-col w-96 mx-auto rounded-md">
      {index == 0 ? null : (
        <OperatorSwitch
          value={outerOperator}
          handleChange={(value) => setOuterOperator(value)}
          name={"name" + index}
        />
      )}
      <>
        {editing ? editingUI : previewUI}
        {canDivide ? (
          <AddDivider handleClick={divide} />
        ) : (
          <RemoveDivider handleClick={undivide} />
        )}
      </>
    </div>
  );
};

const Divider = ({
  child,
  visible = true,
}: {
  child?: React.JSX.Element;
  visible?: boolean;
}) => {
  return (
    <div
      className={
        visible
          ? `group py-1 bg-slate-200`
          : `group py-0 hover:py-1 bg-slate-200`
      }
    >
      <div
        className={
          visible
            ? "mx-auto px-1 max-w-64"
            : "invisible group-hover:visible mx-auto px-1 max-w-64"
        }
      >
        <div className="relative">
          <div className="items-center flex inset-0 absolute">
            <div className="mx-auto border-t-2.5 border-slate-700/50 group-hover:border-slate-500/50 border-solid w-full"></div>
          </div>
          <div className="justify-center flex relative">
            <span className="px-1 bg-slate-200 hover:text-slate-500">
              {child}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddDivider = ({ handleClick }: { handleClick: () => void }) => {
  return (
    <Divider
      visible={false}
      child={
        <button className="font-medium" type="button" onClick={handleClick}>
          Add
        </button>
      }
    />
  );
};

const RemoveDivider = ({ handleClick }: { handleClick: () => void }) => {
  return (
    <Divider
      child={
        <button type="button" className="font-medium" onClick={handleClick}>
          Remove
        </button>
      }
    />
  );
};

const OperatorSwitch = ({
  handleChange,
  value,
  name,
}: {
  handleChange: (value: string) => void;
  value: string;
  name: string;
}) => {
  return (
    <div className="flex flex-row mx-auto my-2">
      <span>
        <input
          type="radio"
          className="peer hidden"
          name={name}
          id={`AND-${name}`}
          onChange={() => handleChange("AND")}
          value={"AND"}
          checked={value === "AND"}
        />
        <label
          htmlFor={`AND-${name}`}
          className="mx-0.5 p-1 w-12 font-semibold rounded-xl border-2 border-slate-400/40 bg-slate-300/75 peer-hover:bg-slate-100/75 peer-checked:bg-white"
        >
          AND
        </label>
      </span>
      <span>
        <input
          type="radio"
          className="peer hidden"
          name={name}
          id={`OR-${name}`}
          onChange={() => handleChange("OR")}
          value={"OR"}
          checked={value === "OR"}
        />
        <label
          htmlFor={`OR-${name}`}
          className="m-0.5 p-1 w-12 font-semibold rounded-xl border-2 border-slate-400/40 bg-slate-300/75 peer-hover:bg-slate-100/75 peer-checked:bg-white"
        >
          OR
        </label>
      </span>
    </div>
  );
};
