import React, { useState } from "react";

interface ToggleSwitchProps {
  isChecked: boolean;
  onChange: (isChecked: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isChecked, onChange }) => {
  return (
    <button
      onClick={() => onChange(!isChecked)}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ease-in-out ${
        isChecked ? "bg-blue-500" : "bg-gray-400"
      }`}
    >
      <span
        className={`inline-block w-6 h-6 rounded-full bg-white shadow transform transition-transform duration-300 ease-in-out ${
          isChecked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
};

export default ToggleSwitch;
