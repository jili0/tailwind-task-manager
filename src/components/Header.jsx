import React from 'react';

function Header({ title, onClear, onPrint }) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto flex justify-between items-center py-2 px-4">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <div className="flex space-x-2">
          <button 
            onClick={onPrint}
            className="px-4 py-1 text-sm border border-blue-300 text-blue-600 rounded hover:bg-blue-50"
            title="Print tasks"
          >
            Print
          </button>
          <button 
            onClick={onClear}
            className="px-4 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50"
            title="Clear all tasks"
          >
            Clear
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;