// TaskInput.jsx
import React, { useState } from 'react';

function TaskInput({ onAddTask }) {
  const [newTask, setNewTask] = useState({
    date: '',
    time: '',
    text: ''
  });

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
      // Before adding, check if we need to format a partial date
      if (newTask.date && newTask.date.match(/^\d{2}$/)) {
        // Format day only (e.g., "04")
        const day = newTask.date;
        const today = new Date();
        const currentMonth = (today.getMonth() + 1).toString().padStart(2, '0');
        const currentYear = today.getFullYear();
        
        const date = new Date(`${currentYear}-${currentMonth}-${day}`);
        const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
        const weekday = days[date.getDay()];
        
        const formattedDate = `${weekday}, ${day}.${currentMonth}.${currentYear}`;
        
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
      else if (newTask.date && newTask.date.match(/^\d{4}$/)) {
        // Format day and month (e.g., "0405")
        const day = newTask.date.substring(0, 2);
        const month = newTask.date.substring(2, 4);
        const today = new Date();
        const currentYear = today.getFullYear();
        
        const date = new Date(`${currentYear}-${month}-${day}`);
        const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
        const weekday = days[date.getDay()];
        
        const formattedDate = `${weekday}, ${day}.${month}.${currentYear}`;
        
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
    <div className="flex w-full border-b border-gray-300 min-h-[42px] items-center bg-white">
      <div className="w-1/4 p-2 border-r border-gray-200">
        <input
          type="text"
          name="date"
          value={newTask.date}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full outline-none bg-transparent"
          placeholder="enter 04 or 0405 or 040525"
        />
      </div>
      <div className="w-1/6 p-2 border-r border-gray-200">
        <input
          type="text"
          name="time"
          value={newTask.time}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full outline-none bg-transparent"
          placeholder="enter 0800 or 0830"
        />
      </div>
      <div className="flex-1 p-2 border-r border-gray-200">
        <input
          type="text"
          name="text"
          value={newTask.text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full outline-none bg-transparent"
          placeholder="Task description"
        />
      </div>
      <div className="w-1/6 flex justify-center items-center">
        <button 
          onClick={handleAddTask}
          className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded"
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default TaskInput;