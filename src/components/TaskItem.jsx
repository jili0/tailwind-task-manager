// TaskItem.jsx
import React, { useState, useEffect, useRef } from 'react';

function TaskItem({ 
  task, 
  index, 
  isEditing, 
  onEdit, 
  onSave, 
  onDelete, 
  onToggleDone 
}) {
  const [editedTask, setEditedTask] = useState({
    date: task.date || '',
    time: task.time || '',
    text: task.text || ''
  });
  const timeInputRef = useRef(null);
  const textInputRef = useRef(null);

  useEffect(() => {
    setEditedTask({
      date: task.date || '',
      time: task.time || '',
      text: task.text || ''
    });
  }, [task]);

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
        setEditedTask(prev => ({
          ...prev,
          date: value
        }));
        return;
      }
      
      // Handle full date (e.g., "040525") - Automatically save when full 6 digits entered
      else if (value.match(/^\d{6}$/)) {
        const day = value.substring(0, 2);
        const month = value.substring(2, 4);
        const year = 2000 + parseInt(value.substring(4, 6));
        
        const date = new Date(`${year}-${month}-${day}`);
        const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
        const weekday = days[date.getDay()];
        
        const formattedDate = `${weekday}, ${day}.${month}.${year}`;
        
        // Save directly with formatted date
        onSave({
          ...task,
          ...editedTask,
          date: formattedDate
        });
        
        return;
      }
    }
    
    // Special handling for time formatting
    if (name === 'time') {
      // Store raw value for hours only (e.g., "08")
      // This allows users to continue typing without premature formatting
      if (value.match(/^\d{1,3}$/)) {
        setEditedTask(prev => ({
          ...prev,
          time: value
        }));
        return;
      }
      
      // Handle hours and minutes (e.g., "0800")
      if (value.match(/^\d{4}$/)) {
        const hours = value.substring(0, 2);
        const minutes = value.substring(2, 4);
        
        setEditedTask(prev => ({
          ...prev,
          time: `${hours}:${minutes}`
        }));
        return;
      }
    }
    
    setEditedTask(prev => ({
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
        if (editedTask.date && (editedTask.date.match(/^\d{2}$/) || editedTask.date.match(/^\d{4}$/))) {
          const today = new Date();
          const currentMonth = (today.getMonth() + 1).toString().padStart(2, '0');
          const currentYear = today.getFullYear();
          
          let day, month, formattedDate;
          
          if (editedTask.date.match(/^\d{2}$/)) {
            // Format day only (e.g., "04")
            day = editedTask.date;
            month = currentMonth;
            
            const date = new Date(`${currentYear}-${month}-${day}`);
            const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
            const weekday = days[date.getDay()];
            
            formattedDate = `${weekday}, ${day}.${month}.${currentYear}`;
          } else {
            // Format day and month (e.g., "0405")
            day = editedTask.date.substring(0, 2);
            month = editedTask.date.substring(2, 4);
            
            const date = new Date(`${currentYear}-${month}-${day}`);
            const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
            const weekday = days[date.getDay()];
            
            formattedDate = `${weekday}, ${day}.${month}.${currentYear}`;
          }
          
          // Update the formatted date in state
          setEditedTask(prev => ({
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
        if (editedTask.time && editedTask.time.match(/^\d{2}$/)) {
          const hours = editedTask.time;
          const formattedTime = `${hours}:00`;
          
          // Update time in state
          setEditedTask(prev => ({
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
      
      // Save task on Enter in text field
      saveTask();
    }
  };

  const saveTask = () => {
    // Only save if there's some content
    if (editedTask.date || editedTask.time || editedTask.text) {
      onSave({
        ...task,
        ...editedTask
      });
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return dateStr;
  };

  if (isEditing) {
    return (
      <div className={`flex w-full border-b border-gray-300 min-h-[42px] items-center 
        ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
        <div className="w-1/4 p-2 border-r border-gray-200">
          <input
            type="text"
            name="date"
            value={editedTask.date}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="w-full outline-none bg-transparent"
            placeholder="enter 04 or 0405 or 040525"
            autoFocus
          />
        </div>
        <div className="w-1/6 p-2 border-r border-gray-200">
          <input
            type="text"
            name="time"
            value={editedTask.time}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="w-full outline-none bg-transparent"
            placeholder="enter 08 or 0830"
            ref={timeInputRef}
          />
        </div>
        <div className="flex-1 p-2 border-r border-gray-200">
          <input
            type="text"
            name="text"
            value={editedTask.text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="w-full outline-none bg-transparent"
            placeholder="Task description"
            ref={textInputRef}
          />
        </div>
        <div className="w-1/6 flex justify-center items-center space-x-2">
          <button 
            onClick={saveTask}
            className="text-green-600 hover:bg-green-50 px-2 py-1 rounded"
          >
            Save
          </button>
          <button 
            onClick={() => onSave(task)}
            className="text-gray-600 hover:bg-gray-50 px-2 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`flex w-full border-b border-gray-300 min-h-[42px] items-center
        ${task.isDone ? 'bg-gray-50 line-through text-gray-400' : 
          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
      onClick={onEdit}
    >
      <div className="w-1/4 p-2 border-r border-gray-200">
        {formatDate(task.date) || ' '}
      </div>
      <div className="w-1/6 p-2 border-r border-gray-200">
        {task.time || ' '}
      </div>
      <div className="flex-1 p-2 border-r border-gray-200">
        {task.text || ' '}
      </div>
      <div className="w-1/6 flex justify-center items-center space-x-2">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleDone();
          }}
          className={`px-2 py-1 rounded ${task.isDone ? 'text-green-600' : 'text-gray-600'}`}
        >
          ✓
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-red-600 hover:bg-red-50 px-2 py-1 rounded"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default TaskItem;