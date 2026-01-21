import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiCheck } from "react-icons/fi";

/**
 * Custom Styled Select Component
 * Replaces native <select> for better styling (dark mode, hover effects).
 * 
 * @param {string} value - Current selected value
 * @param {function} onChange - Callback (newValue) => void
 * @param {Array} options - Array of { value, label }
 * @param {string} placeholder - Display text when no value selected
 */
export default function Select({ value, onChange, options = [], placeholder = "Chọn...", className = "", style = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Find selected label
  const selectedOption = options.find(o => o.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className={`selectWrap ${isOpen ? 'is-open' : ''} ${className}`} ref={containerRef} style={style}>
      {/* Trigger */}
      <div 
        className={`select ${isOpen ? 'is-open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        {displayLabel}
      </div>
      <FiChevronDown className="selectIcon" />

      {/* Dropdown Menu */}
      <div className={`select-menu ${isOpen ? 'is-open' : ''}`}>
        {options.map((o) => {
          const isSelected = o.value === value;
          return (
            <div 
              key={o.value} 
              className={`select-opt ${isSelected ? 'selected' : ''}`}
              onClick={() => handleSelect(o.value)}
            >
              <span>{o.label}</span>
              {isSelected && <FiCheck />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
