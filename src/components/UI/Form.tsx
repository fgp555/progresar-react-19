import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, helperText, className = "", id, ...props }) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = Boolean(error);

  return (
    <div className="form-group">
      {label && <label htmlFor={inputId}>{label}</label>}
      <input id={inputId} className={`${hasError ? "error" : ""} ${className}`} {...props} />
      {error && <div className="error-message">{error}</div>}
      {helperText && !error && (
        <div
          className="helper-text"
          style={{
            marginTop: "var(--spacing-1)",
            fontSize: "var(--font-size-sm)",
            color: "var(--secondary-600)",
          }}
        >
          {helperText}
        </div>
      )}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, error, helperText, options, className = "", id, ...props }) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = Boolean(error);

  return (
    <div className="form-group">
      {label && <label htmlFor={selectId}>{label}</label>}
      <select id={selectId} className={`${hasError ? "error" : ""} ${className}`} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <div className="error-message">{error}</div>}
      {helperText && !error && (
        <div
          className="helper-text"
          style={{
            marginTop: "var(--spacing-1)",
            fontSize: "var(--font-size-sm)",
            color: "var(--secondary-600)",
          }}
        >
          {helperText}
        </div>
      )}
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, helperText, className = "", id, ...props }) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = Boolean(error);

  return (
    <div className="form-group">
      {label && <label htmlFor={textareaId}>{label}</label>}
      <textarea id={textareaId} className={`${hasError ? "error" : ""} ${className}`} {...props} />
      {error && <div className="error-message">{error}</div>}
      {helperText && !error && (
        <div
          className="helper-text"
          style={{
            marginTop: "var(--spacing-1)",
            fontSize: "var(--font-size-sm)",
            color: "var(--secondary-600)",
          }}
        >
          {helperText}
        </div>
      )}
    </div>
  );
};
