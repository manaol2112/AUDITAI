import Select, {components} from 'react-select';


const MultipleSelect = ({ placeholderText, selectOptions, selectedOptions, selectedValue, handleChange, required, customStyles, isMultiSelect, label }) => {
  

  const styles = {
    placeholder: (base, state) => ({
      ...base,
      display: 
        state.isFocused || state.isSelected || state.selectProps.inputValue
        ? 'none'
        : 'block',
    }),
  }

  return (
    <Select
      aria-label={label} // Set aria-label dynamically based on the 'label' prop
      options={selectOptions}
      defaultValue={selectedValue}
      isMulti={isMultiSelect}
      className="basic-multi-select"
      classNamePrefix="select"
      menuPlacement="bottom"
      placeholder={placeholderText}
      value={selectedOptions}
      onChange={handleChange}
      styles={{
        ...customStyles,
        control: (provided, state) => ({
          ...provided,
          minHeight: '50px', 
          height: 'auto',
          boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(0,123,255,.25)' : null, 
        }),
        menu: (provided) => ({
          ...provided,
          maxHeight: '400px',
          fontSize: '14px', 
          zIndex: 9999,
        }),
        option: (provided) => ({
          ...provided,
          fontSize: '14px', 
        }),
        singleValue: (provided) => ({
            ...provided,
            fontSize: '14px', 
          }),
          multiValue: (provided) => ({
            ...provided,
            fontSize: '14px', 
          }),
        placeholder: (provided) => ({  
            ...provided,
            fontSize: '14px',  
          }),
      }}
      aria-required={required} 
      required={required}
    />
  );
}

export default MultipleSelect;