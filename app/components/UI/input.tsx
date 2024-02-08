import { useRef, useState } from "react";

export const FormInput = ({
  label,
  error,
  name,
  type,
  icon: Icon,
  value,
  defaultValue,
  autoComplete,
  placeholder,
  preview = false,
  className,
  disabled = false,
  onChange,
  ...props
}: {
  label?: string;
  error?: boolean;
  name?: string;
  type: string;
  icon?: IconType;
  value?: string;
  defaultValue?: string;
  preview?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  autoComplete?: string;
  onChange?: (e: any) => void;
}) => {
  return (
    <div>
      {!!label ? (
        <label
          htmlFor={name}
          className={`block text-sm font-medium leading-6 ${
            error ? "text-red-600" : "text-gray-900"
          }`}
        >
          {label}
        </label>
      ) : null}
      <div className={`relative w-full rounded-md ${className}`}>
        {!!Icon ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span
              className={`${
                error ? "text-red-600" : "text-gray-500"
              } sm:text-lg`}
            >
              <Icon />
            </span>
          </div>
        ) : null}
        {preview ? (
          <TextPreview icon={!!Icon} value={value} name={name} />
        ) : (
          <TextInput
            value={value}
            type={type}
            icon={!!Icon}
            name={name}
            error={error}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete={autoComplete}
            defaultValue={defaultValue}
            onChange={onChange}
            {...props}
          />
        )}
      </div>
    </div>
  );
};

export const TextInput = ({
  name,
  type = "text",
  error,
  icon = false,
  disabled = false,
  value,
  placeholder,
  autoComplete,
  defaultValue,
  onChange,
  className,
  ...props
}: {
  name?: string;
  icon?: boolean;
  error?: boolean;
  type?: string;
  disabled?: boolean;
  value?: string;
  defaultValue?: string;
  autoComplete?: string;
  placeholder?: string;
  className?: string;
  onChange?: (e: any) => void;
}) => {
  return (
    <input
      type={type}
      name={name}
      id={name}
      disabled={disabled}
      className={`w-full mx-auto rounded-md border-none ring-gray-400/50 ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-400/50 focus:shadow-inner py-1.5 ${
        icon ? "pl-10" : "pl-3"
      } pr-3 minh-[1rem] ${
        error
          ? "text-red-600 ring-red-400 ring-2 focus:ring-red-400/75"
          : "text-gray-900"
      } outline-none focus:ring-inset sm:text-sm sm:leading-6 disabled:bg-gray-100 disabled:text-gray-400 ${className}`}
      placeholder={placeholder}
      value={value}
      defaultValue={defaultValue}
      autoComplete={autoComplete}
      onChange={onChange}
      required
      {...props}
    />
  );
};

export const TextPreview = ({
  name,
  icon = false,
  value,
}: {
  name?: string;
  icon?: boolean;
  value?: string;
}) => {
  return (
    <p
      className={`block w-full rounded-md border-0 py-1.5 ${
        icon ? "pl-10" : "pl-3"
      } minh-[1rem] pr-3 bg-gray-100 text-gray-400 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-300 sm:text-sm sm:leading-6`}
      id={name}
    >
      {value}
    </p>
  );
};

export const TextArea = ({
  name,
  disabled = false,
  value,
  placeholder,
  onChange,
  ...props
}: {
  name?: string;
  disabled?: boolean;
  value?: string;
  autoComplete?: string;
  placeholder?: string;
  onChange?: (e: any) => void;
}) => {
  return (
    <div className="mt-2 w-full sm:w-full rounded-md shadow-sm mx-auto">
      <textarea
        name={name}
        id={name}
        disabled={disabled}
        className={`block w-full rounded-md border-none outline-none py-1.5 pl-3 h-[8rem] text-gray-900  ring-gray-400/50 ring-1 ring-inset placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-300 sm:text-sm sm:leading-6 disabled:bg-gray-100 disabled:text-gray-400`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        {...props}
      />
    </div>
  );
};

export const CheckboxGroup = ({
  name,
  options,
  max = -1,
}: {
  name: string;
  options: any[];
  max?: number;
}) => {
  const [selected, setSelected] = useState<number[]>([]);
  const input = useRef<any>();
  return (
    <>
      {options.map(({ text }: { text: string }, index) => (
        <>
          <input
            ref={input}
            name={name}
            id={text}
            className="peer pointer-events-none"
            hidden
            type="checkbox"
            onChange={() => {
              const s = [...selected, index];
              setSelected(s);
            }}
            disabled={
              selected.length >= max && max > 0 && !selected.includes(index)
            }
            required
            checked={selected.includes(index)}
          />
          <div
            onClick={() => (input.current ? input.current.click() : undefined)}
            className="container box-border text-xl py-2 active:border active:border-4 active:border-slate-600 peer-checked:border-none my-1 bg-slate-200 rounded mx-auto hover:bg-slate-400 active:bg-slate-300 peer-checked:bg-blue-600 text-slate-700 peer-checked:text-slate-100 cursor-pointer peer-checked:cursor-default"
          >
            <label className="pointer-events-none" htmlFor={text}>
              {text}
            </label>
          </div>
        </>
      ))}
    </>
  );
};
