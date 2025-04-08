import React from 'react';

function Header({ title, onClear }) {
  return (
    <header className="bg-purple-200 border-b border-gray-200">
      <div className="max-w-4xl mx-auto flex justify-between items-center py-2 px-4">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <button 
          onClick={onClear}
          className="px-4 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-200"
          title="Clear all tasks"
        >
          Clear
        </button>
      </div>
    </header>
  );
}

export default Header;