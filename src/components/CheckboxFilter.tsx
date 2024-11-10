import React from 'react';

interface CheckboxFilterProps {
  label: string;
  options: string[];
  selectedOptions: string[];
  setSelectedOptions: (selected: string[]) => void;
}

const CheckboxFilter: React.FC<CheckboxFilterProps> = ({ label, options, selectedOptions, setSelectedOptions }) => {
  const toggleOption = (option: string) => {
    setSelectedOptions(selectedOptions.includes(option)
      ? selectedOptions.filter((o) => o !== option)
      : [...selectedOptions, option]);
  };

  return (
    <div>
      <h3>{label}</h3>
      {options.map((option) => (
        <label key={option} style={{
          display: 'flex',
          flexDirection: 'row',
          
        }}>
          <input
            type="checkbox"
            checked={selectedOptions.includes(option)}
            onChange={() => toggleOption(option)}
          />
          {option}
        </label>
      ))}
    </div>
  );
};

export default CheckboxFilter;
