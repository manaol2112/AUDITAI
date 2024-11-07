import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TimePicker = ({ onChange, selected }) => {
  const [selectedTime, setSelectedTime] = useState(null);

  const customInputStyles = {
    width: '500px', // Adjust width as needed
    height: '50px', // Adjust height as needed
    padding: '8px 12px', // Adjust padding as needed
    fontSize: '14px', // Adjust font size as needed
    border: '1px solid', // Border color
    borderRadius: '4px', // Border radius
  };

  const customStyles = {
    
    container: (provided) => ({
      ...provided,
      display: 'inline-block', // Ensures it behaves like an inline element
    }),
    input: (provided) => ({
      ...provided,
      ...customInputStyles, // Merge with custom input styles
    }),
    timeContainer: (provided) => ({
      ...provided,
      zIndex: '1', // Ensure it appears above other elements if necessary
    }),
    calendar: (provided) => ({
      ...provided,
      fontFamily: 'Arial, sans-serif', // Adjust font family as needed
    }),
    header: (provided) => ({
      ...provided,
      backgroundColor: '#f0f0f0', // Header background color
      borderBottom: '1px solid #ccc', // Bottom border
      paddingTop: '8px', // Top padding
      position: 'relative',
      textAlign: 'center', // Center align header text
    }),
    dayNames: (provided) => ({
      ...provided,
      display: 'flex', // Ensure day names display in a row
      justifyContent: 'space-around', // Space evenly between day names
      marginBottom: '8px', // Bottom margin
    }),
    day: (provided) => ({
      ...provided,
      padding: '8px', // Padding around each day
    }),
    selectedDay: (provided) => ({
      ...provided,
      backgroundColor: '#007bff', // Selected day background color
      color: 'white', // Selected day text color
    }),
    hoveredDay: (provided) => ({
      ...provided,
      backgroundColor: '#f0f0f0', // Hovered day background color
      cursor: 'pointer', // Pointer cursor on hover
    }),
    todayDay: (provided) => ({
      ...provided,
      fontWeight: 'bold', // Bold font for today's date
    }),
    navigation: (provided) => ({
      ...provided,
      top: '10px', // Adjust top position as needed
    }),
    navigationIcon: (provided) => ({
      ...provided,
      width: '15px', // Adjust width of icon
      height: '15px', // Adjust height of icon
    }),
    timeHeader: (provided) => ({
      ...provided,
      backgroundColor: '#007bff', // Header background color
      color: 'white', // Header text color
      textAlign: 'center', // Center align header text
      paddingTop: '8px', // Top padding
      paddingBottom: '8px', // Bottom padding
    }),
    timeList: (provided) => ({
      ...provided,
      listStyle: 'none', // No bullet points
      padding: '0', // No padding
      margin: '0', // No margin
      maxHeight: '200px', // Adjust max height as needed
      overflowY: 'auto', // Enable scrolling if necessary
      borderTop: '1px solid #ccc', // Top border
    }),
    timeListItem: (provided) => ({
      ...provided,
      padding: '8px 16px', // Padding around each time option
      cursor: 'pointer', // Pointer cursor
    }),
    selectedTimeListItem: (provided) => ({
      ...provided,
      backgroundColor: '#007bff', // Selected time option background color
      color: 'white', // Selected time option text color
    }),
    timeClassName: (time, currSelected) => {
      // Example function to conditionally apply class based on time and selected state
      return currSelected ? 'time-selected' : '';
    },
  };

  return (
    <div>
      <DatePicker
        selected={selected}
        onChange={onChange}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={60}
        dateFormat="h:mm aa"
        placeholderText="Select time"
        customInput={<input style={customInputStyles} />} // Custom input style
        popperModifiers={{
            preventOverflow: {
              enabled: true,
            },
            applyStyle: {
              enabled: true,
              styles: {
                width: '300px', 
              },
            },
          }}
        popperPlacement="bottom-end"
        popperClassName="popper-class" // Optional: Add custom class to the popper
        wrapperClassName="react-datepicker-wrapper"
        calendarClassName="react-datepicker"
        timeClassName={customStyles.timeClassName} // Provide the function, not an object
        timeInputLabel="Time:"
        dropdownMode="select"
        timeFormat="h:mm aa"
        timeCaption="Time"
        {...customStyles} // Spread customStyles for other configurations
      />
    </div>
  );
};

export default TimePicker;
