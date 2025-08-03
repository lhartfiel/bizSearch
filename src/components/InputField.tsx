import { useState, useEffect, useRef } from "react";
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

const DEBOUNCE_DELAY = 300;

const DebouncedInput = ({
  field,
  name,
  label,
  placeholder,
}: {
  field: FieldProps;
  name: string;
  label: string;
  placeholder: string;
}) => {
  const [localValue, setLocalValue] = useState(field.state.value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Keep local state in sync with form value
  useEffect(() => {
    setLocalValue(field.state.value);
  }, [field.state.value]);

  // Debounce update to parent form
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (localValue !== field.state.value) {
        field.handleChange(localValue);
      }
    }, DEBOUNCE_DELAY);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [localValue, field]);

  return (
    <span className="col-start-1 col-span-12 sm:col-span-6 odd:sm:col-start-1 even:sm:col-start-7 md:col-span-4 odd:md:col-start-3 lg:col-span-3 odd:lg:col-start-4 even:lg:col-start-7">
      <label
        className="block text-zinc-500 dark:text-white text-left text-sm uppercase tracking-wide mb-2"
        htmlFor={name}
      >
        {label}
      </label>
      <input
        className="w-full border-1 border-gray-500 rounded-md p-2 placeholder-zinc-400 text-zinc-600 dark:placeholder-white dark:text-white mb-6 md:mb-0"
        placeholder={placeholder}
        value={localValue}
        onBlur={(e) => {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          field.handleChange(localValue); // ensure blur saves immediately
          field.handleBlur(e);
        }}
        onChange={(e) => setLocalValue(e.target.value)}
      />
    </span>
  );
};

const InputField = ({ name, label, placeholder, form }: InputFieldProps) => {
  return (
    <form.Field
      name={name}
      children={(field: FieldProps) => (
        <DebouncedInput
          field={field}
          name={name}
          label={label}
          placeholder={placeholder}
        />
      )}
    />
  );
};

export { InputField };
