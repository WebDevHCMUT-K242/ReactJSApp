import { useState } from "react";

function ElementEdit({ data, setData, onStopEditing }) {
  const typeOptions = [
    { label: "Heading 1", value: "h1" },
    { label: "Heading 2", value: "h2" },
    { label: "Heading 3", value: "h3" },
    { label: "Paragraph", value: "p" },
  ];

  const inputClass = `px-6 py-2 text-white bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10 relative`;

  const getFontSizeClass = (type: string) => {
    switch (type) {
      case "h1": return "text-2xl";
      case "h2": return "text-xl";
      case "h3": return "text-lg";
      default: return "text-base";
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex gap-1 px-3">
        {typeOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setData({type: opt.value, text: data.text})}
            className={`px-3 py-1 text-sm ${
              data.type === opt.value
                ? "bg-blue-700 text-white border-blue-500"
                : "bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {data.type === "p" ? (
        <textarea
          className={`${inputClass} ${getFontSizeClass(data.type)}`}
          rows={3}
          placeholder="Enter content..."
          value={data.text}
          onChange={(e) => setData({type: data.type, text: e.target.value})}
        />
      ) : (
        <input
          className={`${inputClass} ${getFontSizeClass(data.type)}`}
          type="text"
          placeholder="Enter heading..."
          value={data.text}
          onChange={(e) => setData({type: data.type, text: e.target.value})}
        />
      )}

      <button
        onClick={() => onStopEditing()}
        className="text-sm pl-6 pr-4 py-1 text-left bg-blue-700 text-white hover:bg-blue-600 disabled:bg-blue-950 disabled:text-gray-400 border-b-1 border-b-gray-800"
        disabled={data.text.trim().length === 0}
      >
        Save
      </button>
    </div>
  );
}

export default ElementEdit;
