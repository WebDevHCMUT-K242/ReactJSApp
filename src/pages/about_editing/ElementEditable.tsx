function ElementEditable({ item, index, maxIndex, onEdit, onSetIndex, onDelete }) {
  const elementTypeLabel = (() => {
    switch (item.type) {
      case "h1":
        return "Heading 1";
      case "h2":
        return "Heading 2";
      case "h3":
        return "Heading 3";
      case "p":
        return "Paragraph";
      default:
        return "Unknown";
    }
  })();

  return (
    <div className="relative group mt-2 pt-4 pb-4 border-t-[1px] border-b-[1px] border-gray-800 bg-gray-700">
      {item.type === "h1" && <h1 className="text-3xl pl-6">{item.text}</h1>}
      {item.type === "h2" && <h2 className="text-2xl pl-6">{item.text}</h2>}
      {item.type === "h3" && <h3 className="text-xl pl-6">{item.text}</h3>}
      {item.type === "p" && <p className="text-base pl-6">{item.text}</p>}

      <div className="absolute top-[-0.8em] left-4 flex items-center gap-1">
        <span className="px-2 py-0.5 text-sm text-white bg-slate-500 rounded-full">
          {elementTypeLabel}
        </span>

        <button
          onClick={onEdit}
          className="px-2 py-0.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Edit
        </button>

        <button
          onClick={() => onSetIndex(index - 1)}
          className="px-2 py-0.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-600 disabled:bg-blue-950 disabled:text-gray-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          disabled={index <= 0}
        >
          Move up
        </button>

        <button
          onClick={() => onSetIndex(index + 1)}
          className="px-2 py-0.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-600 disabled:bg-blue-950 disabled:text-gray-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          disabled={index >= maxIndex}
        >
          Move down
        </button>

        <button
          onClick={onDelete}
          className="px-2 py-0.5 text-sm font-medium text-white bg-orange-700 hover:bg-orange-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default ElementEditable;
