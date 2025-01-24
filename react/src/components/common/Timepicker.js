import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TimePicker = ({ onChange, selected }) => {
  const [internalTime, setInternalTime] = useState(null);

  const customInputStyles = {
    height: '50px',
    padding: '8px 12px',
    fontSize: '14px',
    border: '1px solid',
    borderRadius: '4px',
    borderColor: 'lightgrey',
  };

  // Handle the change of time by formatting it correctly without changing time zone
  const handleTimeChange = (time) => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
    onChange(formattedTime);  // Pass the formatted time back to the parent component
  };

  return (
    <div>
      <DatePicker
        selected={selected ? new Date(`1970-01-01T${selected}:00`) : internalTime}  // Create Date object from time string
        onChange={handleTimeChange}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={60}
        dateFormat="h:mm aa"
        placeholderText="Select time"
        customInput={<input style={customInputStyles} />}
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
        popperClassName="popper-class"
        wrapperClassName="react-datepicker-wrapper"
        calendarClassName="react-datepicker"
        timeInputLabel="Time:"
        dropdownMode="select"
        timeFormat="h:mm aa"
        timeCaption="Time"
      />
    </div>
  );
};

export default TimePicker
