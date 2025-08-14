export interface ButtonType {
  buttonSize?: "md" | "lg";
  buttonText: string;
  buttonType?: "primary" | "secondary";
  customClasses?: string;
  disabled?: boolean;
  type?: "submit" | "reset" | "button" | undefined;
  callback: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = ({
  buttonSize = "md",
  buttonText,
  buttonType = "primary",
  customClasses,
  disabled,
  type,
  callback,
}: ButtonType) => {
  return (
    <button
      className={`${buttonType === "primary" ? "bg-[image:var(--bg-button)] hover:shadow-xl hover:cursor-pointer text-white" : "bg-white dark:bg-gradient-dark-start dark:text-white"} ${buttonSize === "md" ? "py-2 px-6 sm:w-[180px]" : "col-span-10 col-start-2 md:col-span-4 md:col-start-5 lg:col-span-4 lg:col-start-5 mt-4 py-4 px-8"} ${customClasses} rounded-full shadow-none transition-shadow duration-300 w-full font-bold uppercase`}
      disabled={disabled}
      type={type}
      onClick={(e) => !disabled && callback(e)}
    >
      {buttonText}
    </button>
  );
};

export { Button };
