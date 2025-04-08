import React, { useState } from 'react';
import TaskItem from './TaskItem';
import TaskInput from './TaskInput';

function TaskList({ 
  tasks, 
  onAddTask, 
  onUpdateTask, 
  onDeleteTask, 
  onToggleTaskDone 
}) {
  const [editingTaskId, setEditingTaskId] = useState(null);

  const handleEditTask = (taskId) => {
    setEditingTaskId(taskId);
  };

  const handleSaveTask = (updatedTask) => {
    onUpdateTask(updatedTask);
    setEditingTaskId(null);
  };

  return (
    <div className="w-full">
      {tasks.map((task, index) => (
        <TaskItem
          key={task.id}
          task={task}
          index={index}
          isEditing={task.id === editingTaskId}
          onEdit={() => handleEditTask(task.id)}
          onSave={handleSaveTask}
          onDelete={() => onDeleteTask(task.id)}
          onToggleDone={() => onToggleTaskDone(task.id)}
        />
      ))}
      <TaskInput onAddTask={onAddTask} />
    </div>
  );
}

export default TaskList;