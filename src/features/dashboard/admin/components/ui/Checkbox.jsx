import React from 'react';
import { FiCheck } from "react-icons/fi";

export default function Checkbox({ checked, onChange, label, className = "" }) {
  return (
    <label className={`checkbox-wrap ${className}`}>
      <input 
        type="checkbox" 
        className="checkbox-input"
        checked={checked} 
        onChange={onChange} 
      />
      <div className={`checkbox-box ${checked ? 'checked' : ''}`}>
        {checked && <FiCheck />}
      </div>
      {label && <span className="checkbox-label">{label}</span>}
    </label>
  );
}
