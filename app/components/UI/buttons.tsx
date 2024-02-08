import { forwardRef } from "react";

// Customisable button with no inherent styling
const Button = ({
  children,
  type,
  className,
  onClick,
  ...props
}: {
  children?: any;
  className: string;
  type?: "button" | "submit" | "reset" | undefined;
  onClick?: () => void;
}) => {
  return (
    <button className={className} type={type} onClick={onClick}>
      {children}
    </button>
  );
};

export const RoundedButton = forwardRef(
  (
    {
      children,
      type,
      onClick,
      disabled,
      className,
      ...props
    }: {
      children?: any;
      type?: "button" | "submit" | "reset" | undefined;
      disabled?: boolean;
      className?: string;
      onClick?: () => void;
    },
    ref
  ) => {
    const enabledStyle =
      "transition-all duration-200 hover:opacity-80 active:scale-95 mx-auto my-2 w-24 bg-primary hover:bg-primary-hover rounded-md p-1 border-2 border-primary hover:border-primary-hover";
    const disabledStyle =
      "mx-auto my-2 w-24 bg-primary/40 rounded-md p-1 border-2 border-primary cursor-not-allowed";
    return (
      <button
        disabled={disabled}
        className={`${disabled ? disabledStyle : enabledStyle} ${className}`}
        type={type}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export const RoundedSecondaryButton = ({
  children,
  type,
  onClick,
  ...props
}: {
  children?: any;
  type?: "button" | "submit" | "reset" | undefined;
  onClick?: () => void;
}) => {
  const style =
    "transition-all duration-200 hover:opacity-80 active:scale-95 mx-auto my-2 w-24 bg-secondary hover:bg-secondary-hover rounded-md p-1 border-2 border-secondary hover:border-secondary-hover";
  return (
    <button className={style} type={type} onClick={onClick}>
      {children}
    </button>
  );
};

export const CircleButton = ({
  children,
  type,
  onClick,
  ...props
}: {
  children?: any;
  type?: "button" | "submit" | "reset" | undefined;
  onClick?: () => void;
}) => {
  const style =
    "transition-all duration-200 hover:opacity-80 active:scale-95 text-center rounded-full w-8 h-8 bg-primary hover:bg-primary-hover border-2 border-primary hover:border-primary-hover";
  return (
    <button className={style} type={type} onClick={onClick}>
      {children}
    </button>
  );
};

export const CircleSecondaryButton = ({
  children,
  type,
  onClick,
  ...props
}: {
  children?: any;
  type?: "button" | "submit" | "reset" | undefined;
  onClick?: () => void;
}) => {
  const style =
    "transition-all duration-200 hover:opacity-80 active:scale-95 text-center rounded-full w-8 h-8 bg-secondary hover:bg-secondary-hover border-2 border-secondary hover:border-secondary-hover";
  return (
    <button className={style} type={type} onClick={onClick}>
      {children}
    </button>
  );
};
