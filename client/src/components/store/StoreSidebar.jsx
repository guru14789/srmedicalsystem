import React from 'react';

const StoreSidebar = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`block w-full text-left px-5 py-3 rounded-2xl text-sm transition-all duration-300 ${selectedCategory === category.id
              ? 'bg-[#373086] text-white font-bold shadow-md transform translate-x-2'
              : 'text-gray-500 hover:text-[#373086] hover:bg-gray-50'
            }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default StoreSidebar;