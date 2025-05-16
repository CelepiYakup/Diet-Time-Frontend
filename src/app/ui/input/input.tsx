import { FieldError, UseFormRegister } from "react-hook-form";

import styles from "./input.module.scss";

type InputModeType =
  | "none"
  | "text"
  | "email"
  | "url"
  | "search"
  | "tel"
  | "numeric"
  | "decimal"

type Props = {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  inputMode?: InputModeType;
};

const Input = ({ 
  label, 
  name, 
  type = "text", 
  placeholder, 
  register, 
  error, 
  inputMode = "text" 
}: Props) => {
  return (
    <div className={error ? styles.inputContainerError : styles.inputContainer}>
      <div className={styles.inputWrapper}>
        <input
          id={name}
          type={type}
          placeholder={placeholder || label}
          className={styles.input}
          inputMode={inputMode}
          {...register(name)}
        />
      </div>

      {error && (
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>{error.message}</p>
        </div>
      )}
    </div>
  );
};
export default Input;
