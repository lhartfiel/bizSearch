interface InputFieldProps {
  name: string;
  label: string;
  placeholder: string;
  form: any;
}

interface FieldState {
  value: string;
}

interface FieldProps {
  state: FieldState;
  handleBlur: React.FocusEventHandler<HTMLInputElement>;
  handleChange: (value: string) => void;
}

const InputField = ({ name, label, placeholder, form }: InputFieldProps) => {
  return (
    <form.Field
      name={name}
      children={(field: FieldProps) => (
        <span className="col-start-1 col-span-12 sm:col-span-6 odd:sm:col-start-1 even:sm:col-start-7 md:col-span-4 odd:md:col-start-3 lg:col-span-3 odd:lg:col-start-4 even:lg:col-start-7">
          <label
            className="block text-zinc-500 dark:text-white text-left text-sm uppercase tracking-wide mb-2"
            htmlFor="name"
          >
            {label}
          </label>
          <input
            className="w-full border-1 border-gray-300 rounded-md p-2 placeholder-zinc-400 text-zinc-600 dark:placeholder-white dark:text-white"
            placeholder={placeholder}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        </span>
      )}
    />
  );
};

export { InputField };
