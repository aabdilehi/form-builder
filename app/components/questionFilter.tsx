import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { loader } from "~/routes/questions.$id";
import { CircleSecondaryButton, RoundedSecondaryButton } from "./UI/buttons";

// NEED TO UPDATE TO NEW SCHEMA (assuming this even gets used again)

export default ({
  values,
  setValues,
}: {
  values: any;
  setValues: (v: any) => void;
}) => {
  // Move outside of this by having the demo editor or whatever use the same key as this fetcher.
  const fetcher = useFetcher<typeof loader>({ key: "question-fetcher" });
  const questions = fetcher.data ?? [];
  const [selected, setSelected] = useState(-1);

  useEffect(() => {
    fetcher.load("/questions/d52f5894-a3c5-41a7-a53b-e4dafcaa6f17");
  }, []);

  // Clear values when selected question changes
  useEffect(() => {
    setValues;
  }, [selected]);

  return (
    <div>
      {/* <QuestionSelect data={questions} selected={selected} setSelected={(value) => setSelected(value)}/> */}
      {selected !== -1
        ? getAnswerType(
            questions[selected].answer,
            questions[selected].type,
            values,
            setValues
          )
        : null}
    </div>
  );
};

export const QuestionSelect = ({
  data,
  question,
  setQuestion,
}: {
  data: Array<any>;
  question: { text: string; type: string; index: number };
  setQuestion: (text: string, type: string, index: number) => void;
}) => {
  return (
    <select
      value={question?.index ?? -1}
      onChange={(e) =>
        setQuestion(
          data[Number(e.target.value)].text,
          data[Number(e.target.value)].type,
          Number(e.target.value)
        )
      }
    >
      <option value={-1}>Select a question</option>
      {data.map(({ text }, index) => (
        <option value={index}>{text}</option>
      ))}
    </select>
  );
};

// title property becomes question
// text inputs for answers become dropdown
// when question changes, answers should be cleared in data

export const getAnswerType = (
  data: any,
  type: string,
  values: any,
  onChange: (value: string, index: number) => void
) => {
  switch (type) {
    case "single-select":
    case "multi-select":
      return values?.map((aValue: string, index: number) => (
        <AnswerSelect
          data={data}
          value={aValue}
          onChange={(v) => onChange(v, index)}
        />
      ));
    case "number":
    case "range":
      return <AnswerRange />;
    case "text":
      return (
        <AnswerInput
          value={values[0]}
          onChange={(value) => onChange(value, 0)}
        />
      );
    default:
      return null;
  }
};

// Single and Multi choice questions
const AnswerSelect = ({
  data,
  value,
  onChange,
}: {
  data: Array<any>;
  value: string;
  onChange: (v: string) => void;
}) => {
  useEffect(() => {
    onChange(data[0].id);
  }, []);
  return (
    <select onChange={(e) => onChange(e.target.value)}>
      {data.map(({ id, text }, index) => (
        <option value={id}>{text}</option>
      ))}
    </select>
  );
};

// Range and Number questions
const AnswerRange = () => {
  return <input type="range" />;
};

// Text questions
const AnswerInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  return (
    <input
      type="text"
      placeholder="Contains"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
