import { useState } from "react";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";

export default ({
  items,
  renderItem,
  startIndex = 0,
  fullscreen = false,
  disabled = false,
  ...props
}: {
  items: any[];
  renderItem: (
    item: any,
    index?: number
  ) => React.JSX.Element | React.JSX.Element[];
  fullscreen?: boolean;
  startIndex?: number;
  disabled?: boolean;
}) => {
  const [index, setIndex] = useState(startIndex);
  return (
    <div className="m-0 w-full h-full">
      {props.children ?? null}
      {renderItem(items[index], index)}
      <div
        className={`${
          fullscreen
            ? "absolute w-full bg-indigo-50 ring-2 ring-indigo-200/50"
            : "rounded-md w-fit mx-auto bg-transparent"
        } flex flex-row items-center justify-center space-x-2 bottom-0 m-0 text-lg text-center`}
      >
        <button
          type="button"
          className="bg-indigo-400/50 hover:bg-indigo-400 text-white rounded-md p-1 m-1"
          onClick={() => setIndex((prev) => Math.max(0, --prev))}
        >
          <MdOutlineKeyboardArrowLeft className="mx-auto" />
        </button>
        {items.map((item, aindex) => (
          <button
            className={
              aindex === index
                ? "font-medium text-indigo-400 p-1 m-1"
                : "text-indigo-300 hover:text-indigo-400 p-1 m-1"
            }
            type="button"
            onClick={() => setIndex(aindex)}
          >
            {aindex + 1}
          </button>
        ))}
        <button
          type="button"
          className="bg-indigo-400/50 hover:bg-indigo-400 text-white rounded-md p-1 m-1"
          onClick={() => setIndex((prev) => Math.min(items.length - 1, ++prev))}
        >
          <MdOutlineKeyboardArrowRight className="mx-auto" />
        </button>
      </div>
    </div>
  );
};
