import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import TaskList from './components/TaskList';
import './css/App.css';

const STORAGE_KEY = 'taskManagerV2_tasks';

function App() {
  const [tasks, setTasks] = useState([]);

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks]);

  // Function to convert date string to a sortable number
  const getDateSortValue = (dateStr) => {
    if (!dateStr) return Infinity;
    const match = dateStr.match(/^[A-Za-z]{2}, (\d{2})\.(\d{2})\.(\d{4})$/);
    if (match) {
      const [_, day, month, year] = match;
      return parseInt(`${year}${month}${day}`);
    }
    return Infinity;
  };

  // Function to convert time string to a sortable number
  const getTimeSortValue = (timeStr) => {
    if (!timeStr) return Infinity;
    const match = timeStr.match(/^(\d{1,2}):(\d{2})$/);
    if (match) {
      const [_, hours, minutes] = match;
      return parseInt(`${hours.padStart(2, '0')}${minutes}`);
    }
    return Infinity;
  };

  // Sort tasks by date and time
  const sortTasks = useCallback((tasksToSort) => {
    return [...tasksToSort].sort((a, b) => {
      // Handle empty tasks
      const aEmpty = !a.date && !a.time && !a.text;
      const bEmpty = !b.date && !b.time && !b.text;
      
      if (aEmpty && !bEmpty) return 1;
      if (!aEmpty && bEmpty) return -1;
      if (aEmpty && bEmpty) return 0;

      // Compare dates
      const dateA = getDateSortValue(a.date);
      const dateB = getDateSortValue(b.date);
      
      if (dateA !== dateB) {
        return dateA - dateB;
      }

      // If dates are the same, compare times
      const timeA = getTimeSortValue(a.time);
      const timeB = getTimeSortValue(b.time);
      
      return timeA - timeB;
    });
  }, []);

  // Add a new task
  const addTask = useCallback((newTask) => {
    const updatedTasks = sortTasks([...tasks, { 
      ...newTask, 
      id: Date.now(), 
      isDone: false 
    }]);
    setTasks(updatedTasks);
  }, [tasks, sortTasks]);

  // Update an existing task
  const updateTask = useCallback((updatedTask) => {
    const updatedTasks = tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    );
    
    const sortedTasks = sortTasks(updatedTasks);
    setTasks(sortedTasks);
  }, [tasks, sortTasks]);

  // Delete a task
  const deleteTask = useCallback((taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
  }, [tasks]);

  // Toggle task done status
  const toggleTaskDone = useCallback((taskId) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, isDone: !task.isDone } : task
    );
    setTasks(updatedTasks);
  }, [tasks]);

  // Clear all tasks
  const clearTasks = () => {
    if (window.confirm('Are you sure you want to clear all tasks?')) {
      setTasks([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200">
      <Header 
        title="Task Manager" 
        onClear={clearTasks} 
      />
      <div className="w-full max-w-4xl mx-auto p-4">
        <TaskList 
          tasks={tasks}
          onAddTask={addTask}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
          onToggleTaskDone={toggleTaskDone}
        />
      </div>
    </div>
  );
}

export default App;