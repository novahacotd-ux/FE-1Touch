import React from "react";

export default function IconButton({ title, children, ...props }) {
  return (
    <button className="clm-ibtn" title={title} aria-label={title} {...props}>
      {children}
    </button>
  );
}
