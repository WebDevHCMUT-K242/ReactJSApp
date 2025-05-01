import { useAuth } from "../common/AuthContext.ts";
import { useEffect, useState } from "react";
import TitleEdit from "./about_editing/TitleEdit.tsx";

interface Element {
  id: number;
  type: string;
  text: string;
}

interface Data {
  title: string;
  contents: Element[];
  last_updated: number;
}

function About() {
  const { userCore, userMeta, logout, loading: userAuthLoading } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState<Data>({ title: '', contents: [], last_updated: 0 });
  const [loading, setLoading] = useState(true);

  const [editedElement, setEditedElement] = useState<"title" | number | null>(null);

  const isAdmin = !userAuthLoading && (userCore?.is_admin || false);

  useEffect(() => {
    fetch('/api/editable_about/json.php')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setData(json.data);
        }
        setLoading(false);
      });
  }, []);

  const setTitle = (newTitle: string) => {
    fetch('/api/editable_about/set_title.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setData(json.data);
        }
      });
  };

  const insertElement = (type: string, text: string, index: number) => {
    fetch('/api/editable_about/insert_element.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, text, index })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
      });
  };

  const removeElement = (id: number) => {
    fetch('/api/editable_about/remove_element.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
      });
  };

  const updateElement = (id: number, type: string, text: string, index: number) => {
    fetch('/api/editable_about/update_element.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, type, text, index })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
      });
  };

  return (
    <div className="flex flex-col flex-1 py-4 space-y-2 bg-blue-900 text-white">
      {editedElement === "title" ? (
        <TitleEdit originalTitle={data.title} onSaveTitle={(t: string) => {
          setTitle(t);
          setEditedElement(null);
        }} />
      ) : (
        isEditing ? (
          <h1 className="flex flex-row gap-3 items-center mb-4 text-3xl font-medium">
            <button
              onClick={() => setEditedElement("title")}
              className="text-sm pl-6 pr-4 py-1 text-left bg-blue-700 text-white hover:bg-blue-600 disabled:bg-blue-950 disabled:text-gray-400 border-b-1 border-b-gray-800"
            >
              Edit title
            </button>
            {data.title}
          </h1>
        ) : (
          <h1 className="flex flex-row gap-2 items-center mb-4 px-6 text-3xl font-medium">
            {data.title}
          </h1>
        )
      )}

      <div className="space-y-4">
        {data.contents.map((el, i) => (
          <div key={el.id} className="space-y-1">
            {isEditing ? (
              <div className="flex gap-2 items-center">
                <select
                  value={el.type}
                  onChange={(e) => updateElement(el.id, e.target.value, el.value, i)}
                  className="bg-blue-800 text-white"
                >
                  <option value="h1">Heading 1</option>
                  <option value="p">Paragraph</option>
                </select>
                <input
                  className="bg-blue-800 text-white flex-1 px-2 py-1"
                  value={el.value}
                  onChange={(e) => updateElement(el.id, el.type, e.target.value, i)}
                />
                <button
                  onClick={() => removeElement(el.id)}
                  className="bg-red-600 px-2 py-1 hover:bg-red-500"
                >
                  Delete
                </button>
              </div>
            ) : (
              el.type === 'h1' ? <h1 className="text-xl font-bold">{el.value}</h1> : <p>{el.value}</p>
            )}
          </div>
        ))}

        {isEditing && (
          <button
            onClick={() => insertElement('p', 'New text', data.contents.length)}
            className="mt-2 text-sm pl-6 pr-4 py-1 text-left bg-blue-700 text-white hover:bg-blue-600 disabled:bg-blue-950 disabled:text-gray-400 border-b-1 border-b-gray-800"
            disabled={editedElement !== null}
          >
            Add element
          </button>
        )}
      </div>

      {isAdmin && (
        isEditing ? (
          <button
            onClick={() => {
              setEditedElement(null);
              setIsEditing(false);
            }}
            className="self-start pl-6 pr-4 py-1 flex-0 text-left text-sm bg-orange-700 hover:bg-orange-600 border-b border-gray-800"
          >
            Admin: Stop editing page <span className="font-medium">(discards unsaved changes!)</span>
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="self-start pl-6 pr-4 py-1 flex-0 text-left text-sm bg-orange-700 hover:bg-orange-600 border-b border-gray-800"
          >
            Admin: Start editing page
          </button>
        )
      )}
    </div>
  );
}

export default About;
