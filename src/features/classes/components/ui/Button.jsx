import React from "react";

export default function Button({ variant = "primary", size = "md", leftIcon, children, ...props }) {
  return (
    <button className={`clm-btn clm-btn--${variant} clm-btn--${size}`} {...props}>
      {leftIcon ? <span className="clm-btn__ic">{leftIcon}</span> : null}
      <span className="clm-btn__tx">{children}</span>
    </button>
  );
}
