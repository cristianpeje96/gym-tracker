import React from "react";
import "./Button.module.css";

export const Button = ({
  children,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  onClick,
  disabled = false,
  type = "button",
}) => {
  const bemClasses = [
    "button",
    `button--${variant}`,
    `button--${size}`,
    fullWidth && "button--full-width",
    disabled && "button--disabled",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={bemClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
