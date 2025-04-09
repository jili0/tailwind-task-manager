// TaskInput.jsx
import React, { useState, useRef } from 'react';

function TaskInput({ onAddTask }) {
  const [newTask, setNewTask] = useState({
    date: '',
    time: '',
    text: ''
  });
  const timeInputRef = useRef(null);
  const textInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for date formatting
    if (name === 'date') {
      const today = new Date();
      const currentMonth = (today.getMonth() + 1).toString().padStart(2, '0');
      const currentYear = today.getFullYear();
      const currentYearShort = currentYear.toString().substring(2);
      
      // Store the raw value for day only (e.g., "04") or day-month (e.g., "0405")
      // This allows users to continue typing without premature formatting
      if (value.match(/^\d{1,5}$/)) {
        setNewTask(prev => ({
          ...prev,
          date: value
        }));
        return;
      }
      
      // Handle full date (e.g., "040525") - Automatically add task when full 6 digits entered
      else if (value.match(/^\d{6}$/)) {
        const day = value.substring(0, 2);
        const month = value.substring(2, 4);
        const year = 2000 + parseInt(value.substring(4, 6));
        
        const date = new Date(`${year}-${month}-${day}`);
        const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
        const weekday = days[date.getDay()];
        
        const formattedDate = `${weekday}, ${day}.${month}.${year}`;
        
        // Add task directly with formatted date
        onAddTask({
          ...newTask,
          date: formattedDate
        });
        
        // Reset input fields after adding task
        setNewTask({
          date: '',
          time: '',
          text: ''
        });
        
        return;
      }
    }
    
    // Special handling for time formatting
    if (name === 'time') {
      // Store raw value for hours only (e.g., "08")
      // This allows users to continue typing without premature formatting
      if (value.match(/^\d{1,3}$/)) {
        setNewTask(prev => ({
          ...prev,
          time: value
        }));
        return;
      }
      
      // Handle hours and minutes (e.g., "0800")
      if (value.match(/^\d{4}$/)) {
        const hours = value.substring(0, 2);
        const minutes = value.substring(2, 4);
        
        setNewTask(prev => ({
          ...prev,
          time: `${hours}:${minutes}`
        }));
        return;
      }
    }
    
    setNewTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // Special handling for date field - move focus to time field
      if (e.target.name === 'date') {
        e.preventDefault(); // Prevent the default Enter action
        
        // Format date if it matches the patterns
        if (newTask.date && (newTask.date.match(/^\d{2}$/) || newTask.date.match(/^\d{4}$/))) {
          const today = new Date();
          const currentMonth = (today.getMonth() + 1).toString().padStart(2, '0');
          const currentYear = today.getFullYear();
          
          let day, month, formattedDate;
          
          if (newTask.date.match(/^\d{2}$/)) {
            // Format day only (e.g., "04")
            day = newTask.date;
            month = currentMonth;
            
            const date = new Date(`${currentYear}-${month}-${day}`);
            const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
            const weekday = days[date.getDay()];
            
            formattedDate = `${weekday}, ${day}.${month}.${currentYear}`;
          } else {
            // Format day and month (e.g., "0405")
            day = newTask.date.substring(0, 2);
            month = newTask.date.substring(2, 4);
            
            const date = new Date(`${currentYear}-${month}-${day}`);
            const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
            const weekday = days[date.getDay()];
            
            formattedDate = `${weekday}, ${day}.${month}.${currentYear}`;
          }
          
          // Update the formatted date in state
          setNewTask(prev => ({
            ...prev,
            date: formattedDate
          }));
        }
        
        // Move focus to time field
        if (timeInputRef.current) {
          timeInputRef.current.focus();
        }
        return;
      }
      
      // Special handling for time field - move focus to text field
      if (e.target.name === 'time') {
        e.preventDefault(); // Prevent the default Enter action
        
        // Format time if it matches the 2-digit pattern
        if (newTask.time && newTask.time.match(/^\d{2}$/)) {
          const hours = newTask.time;
          const formattedTime = `${hours}:00`;
          
          // Update time in state
          setNewTask(prev => ({
            ...prev,
            time: formattedTime
          }));
        }
        
        // Move focus to text field
        if (textInputRef.current) {
          textInputRef.current.focus();
        }
        return;
      }
      
      // Add the task if Enter is pressed in text field
      handleAddTask();
    }
  };

  const handleAddTask = () => {
    // Only add task if there's some content
    if (newTask.date || newTask.time || newTask.text) {
      onAddTask(newTask);
      // Reset input fields after adding task
      setNewTask({
        date: '',
        time: '',
        text: ''
      });
    }
  };

  return (
    <div className="flex w-full border-4 border-blue-700 min-h-[42px] items-center bg-blue-100">
      <div className="w-1/4 p-2 border-r border-gray-700">
        <input
          type="text"
          name="date"
          value={newTask.date}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full outline-none"
          placeholder="enter 04 or 0405 or 040525"
        />
      </div>
      <div className="w-1/6 p-2 border-r border-gray-700">
        <input
          type="text"
          name="time"
          value={newTask.time}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full outline-none"
          placeholder="enter 08 or 0830"
          ref={timeInputRef}
        />
      </div>
      <div className="flex-1 p-2 border-r border-gray-700">
        <input
          type="text"
          name="text"
          value={newTask.text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full outline-none"
          placeholder="Task description"
          ref={textInputRef}
        />
      </div>
      <div className="w-1/6 flex justify-center items-center">
        <button 
          onClick={handleAddTask}
          className="text-blue-600 hover:bg-blue-200 px-2 py-1 rounded"
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default TaskInput;