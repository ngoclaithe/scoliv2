import React, { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      label,
      type = "text",
      placeholder,
      error,
      helperText,
      icon,
      rightIcon,
      size = "md",
      disabled = false,
      required = false,
      className = "",
      ...props
    },
    ref,
  ) => {
    const baseClasses =
      "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500";

    const sizes = {
      sm: "px-2 py-1.5 text-sm",
      md: "px-3 py-2 text-sm",
      lg: "px-4 py-3 text-base",
    };

    const errorClasses = error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "";
    const sizeClasses = sizes[size];
    const classes = `${baseClasses} ${sizeClasses} ${errorClasses} ${className}`;

    return (
      <div className="w-full">
        {label && (
          <label className="mb-1 block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-400">{icon}</span>
            </div>
          )}

          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={`${classes} ${icon ? "pl-10" : ""} ${rightIcon ? "pr-10" : ""}`}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-400">{rightIcon}</span>
            </div>
          )}
        </div>

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
