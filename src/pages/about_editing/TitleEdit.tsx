import { useState } from "react";

function TitleEdit({ originalTitle, onSaveTitle }) {
  const [title, setTitle] = useState(originalTitle);
  return (
    <div className="flex flex-col">
      <input
        className="text-xl px-6 py-2 bg-gray-900 text-white border-t-1 border-t-gray-800 border-b-1 border-b-gray-800 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:z-10 relative"
        placeholder="Write your title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        onClick={() => onSaveTitle(title)}
        className="text-sm pl-6 pr-4 py-1 text-left bg-blue-700 text-white hover:bg-blue-600 disabled:bg-blue-950 disabled:text-gray-400 border-b-1 border-b-gray-800"
        disabled={title.trim().length === 0}
      >
        Save
      </button>
    </div>
  );
}

export default TitleEdit;