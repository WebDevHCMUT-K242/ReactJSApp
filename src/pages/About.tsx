import { useAuth } from "../common/AuthContext.ts";
import { useEffect, useState } from "react";

function About() {
  const { userCore, userMeta, logout, loading: userAuthLoading } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState({ title: '', contents: [], last_updated: 0 });
  const [loading, setLoading] = useState(true);

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

  const setTitle = (newTitle) => {
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

  const insertElement = (type, text, index) => {
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

  const removeElement = (id) => {
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

  const updateElement = (id, type, text, index) => {
    fetch('/api/editable_about/update_element.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, type, text, index })
    })
      .then(res => res.text())
      .then(json => {
        console.log(json)
        json = JSON.parse(json)
        if (json.success) setData(json.data);
      });
  };

  return (
    <div className="flex flex-col flex-1 py-4 space-y-2 bg-blue-900 text-white">
      <h1 className="px-6 mb-4 text-3xl font-medium">
        {isEditing ? (
          <input
            className="bg-blue-700 text-white px-2 py-1"
            value={data.title}
            onChange={(e) => setTitle(e.target.value)}
          />
        ) : data.title}
      </h1>

      {isAdmin && (
        isEditing ? (
          <button
            onClick={() => setIsEditing(false)}
            className="self-start pl-6 pr-4 py-1 flex-0 text-left text-sm bg-orange-700 hover:bg-orange-600 border-b border-gray-800"
          >
            Admin: Stop editing page
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

      <div className="px-6 space-y-4">
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
            className="mt-4 bg-green-600 hover:bg-green-500 px-4 py-2"
          >
            Add new element
          </button>
        )}
      </div>
    </div>
  );
}

export default About;
