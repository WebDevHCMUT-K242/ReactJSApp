import React, { useEffect, useState } from "react";
import { useAuth } from "../common/AuthContext";
import "./Home.css";


interface HomeElementEditableProps {
    item: HomeElement;
    index: number;
    maxIndex: number;
    onEdit: () => void;
    onSetIndex: (newIndex: number) => void;
    onDelete: () => void;
    children: React.ReactNode; 
    disabled: boolean; 
}

const HomeElementEditable: React.FC<HomeElementEditableProps> = ({
    item, index, maxIndex, onEdit, onSetIndex, onDelete, children, disabled
}) => {
    return (
        <div className="relative p-2 border border-dashed border-gray-500 mb-4">
             <span className="absolute top-0 left-0 bg-gray-700 text-white text-xs px-1 py-0.5 rounded-br">
                {item.type} (ID: {item.id})
            </span>
            {children}
            <div className="absolute top-0 right-0 bg-gray-800 bg-opacity-80 p-1 space-x-1">
                <button
                    onClick={() => onSetIndex(index - 1)}
                    disabled={index === 0 || disabled}
                    className="px-2 py-0.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded disabled:bg-gray-500"
                    title="Move Up"
                >
                    ▲
                </button>
                <button
                     onClick={() => onSetIndex(index + 1)}
                    disabled={index === maxIndex || disabled}
                    className="px-2 py-0.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded disabled:bg-gray-500"
                    title="Move Down"
                >
                    ▼
                </button>
                <button
                     onClick={onEdit}
                    disabled={disabled}
                    className="px-2 py-0.5 text-xs bg-yellow-600 hover:bg-yellow-500 text-white rounded disabled:bg-gray-500"
                    title="Edit"
                >
                    Edit
                </button>
                <button
                    onClick={onDelete}
                    disabled={disabled}
                    className="px-2 py-0.5 text-xs bg-red-600 hover:bg-red-500 text-white rounded disabled:bg-gray-500"
                    title="Delete"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

interface HomeElementEditProps {
    data: { id: number; type: string; content: any; index: number };
    setData: (newData: { type: string; content: any; }) => void;
    onStopEditing: () => void;
}

const HomeElementEdit: React.FC<HomeElementEditProps> = ({ data, setData, onStopEditing }) => {
    const [contentString, setContentString] = useState(() => {
        return typeof data.content === 'object' ? JSON.stringify(data.content, null, 2) : String(data.content);
    });
    const [isValidJson, setIsValidJson] = useState(true);

    const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newString = event.target.value;
        setContentString(newString);
        try {
            const parsedContent = JSON.parse(newString);
            setData({ type: data.type, content: parsedContent });
            setIsValidJson(true);
        } catch (e) {
             setData({ type: data.type, content: newString});
            setIsValidJson(false);
             if(typeof data.content === 'string') setIsValidJson(true); 
        }
    };

    const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
         setData({ type: event.target.value, content: data.content });
    };

    return (
        <div className="p-4 border-2 border-green-500 bg-gray-800 mb-4 space-y-2">
             <h4 className="text-lg font-semibold text-white">Editing Element (ID: {data.id})</h4>
            <div>
                 <label className="block text-sm font-medium text-gray-300 mb-1">Element Type:</label>
                <input
                    type="text"
                    value={data.type}
                    onChange={handleTypeChange}
                    className="w-full p-1 bg-gray-700 text-white border border-gray-600 rounded"
                />
            </div>
             <div>
                 <label className="block text-sm font-medium text-gray-300 mb-1">Content (Edit JSON for complex types):</label>
                 <textarea
                     value={contentString}
                     onChange={handleContentChange}
                     rows={10}
                     className={`w-full p-1 bg-gray-700 text-white border ${isValidJson ? 'border-gray-600' : 'border-red-500'} rounded font-mono text-sm`}
                 />
                 {!isValidJson && <p className="text-red-400 text-xs mt-1">Warning: Content might not be valid JSON.</p>}
             </div>
            <button
                onClick={onStopEditing}
                 disabled={!isValidJson && typeof data.content !== 'string'} 
                className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded disabled:bg-gray-500"
            >
                Save Changes
            </button>
        </div>
    );
};

interface HomeElement {
    id: number;
    type: string;
    content: any;
    style?: React.CSSProperties;
    className?: string;
}

interface HomeData {
    elements: HomeElement[];
}

function Home() {
    const [homeData, setHomeData] = useState<HomeData>({ elements: [] });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedElementId, setEditedElementId] = useState<number | null>(null);
    const [editedData, setEditedData] = useState<{ id: number, type: string; content: any; index: number } | null>(null);

    const { userCore, loading: userAuthLoading } = useAuth();
    const isAdmin = !userAuthLoading && (userCore?.is_admin || false);

    const fetchData = () => {
        setLoading(true);
        fetch('/api/editable_home/json.php')
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then(json => {
                if (json.success && json.data) {
                    setHomeData(json.data);
                     setError(null);
                } else {
                    throw new Error(json.error || 'Failed to fetch home data structure');
                }
            })
            .catch(err => {
                console.error("Failed to fetch home data:", err);
                setError(err.message || 'An error occurred while fetching data.');
                 setHomeData({ elements: [] });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData(); 
    }, []);

    const handleApiResponse = (promise: Promise<Response>) => {
         return promise
             .then(res => res.json())
             .then(json => {
                 if (json.success && json.data) {
                     setHomeData(json.data);
                     setError(null);
                 } else {
                      setError(json.error || 'API operation failed.');
                 }
             })
             .catch(err => {
                  console.error("API Error:", err);
                  setError("An error occurred during the API request.");
             });
    };

    const insertElement = (type: string, content: any, index: number) => {
        const contentPayload = typeof content === 'object' ? JSON.stringify(content) : content;
        handleApiResponse(fetch('/api/editable_home/insert_element.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, content: contentPayload, index })
        }));
    };

    const updateElement = (id: number, type: string, content: any, index: number) => {
         const contentPayload = typeof content === 'object' ? JSON.stringify(content) : content;
         handleApiResponse(fetch('/api/editable_home/update_element.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, type, content: contentPayload, index })
         })).finally(() => {
              setEditedElementId(null);
              setEditedData(null);
         });
    };

    const removeElement = (id: number) => {
        if (window.confirm(`Are you sure you want to delete element ID ${id}?`)) {
            handleApiResponse(fetch('/api/editable_home/remove_element.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            }));
        }
    };

     const startEditingElement = (element: HomeElement, index: number) => {
         if (editedElementId !== null) {
             alert("Please save changes on the currently edited element first.");
             return;
         }
         setEditedElementId(element.id);
         setEditedData({ id: element.id, type: element.type, content: element.content, index });
     };

     const saveEditedElement = () => {
         if (editedData) {
             updateElement(editedData.id, editedData.type, editedData.content, editedData.index);
         }
     };

    const renderElement = (element: HomeElement, index: number, isCurrentlyEditing: boolean) => {
        if (isEditing && editedElementId === element.id && editedData) {
             return (
                 <HomeElementEdit
                     key={element.id + "-edit"} 
                     data={editedData}
                     setData={(newData) => setEditedData({ ...editedData, ...newData })} 
                     onStopEditing={saveEditedElement} 
                 />
             );
        }

        let elementView: React.ReactNode = null;
         switch (element.type) {
             case 'hero':
                 elementView = (
                     <div className={element.className || "main-container"} style={element.style}>
                         <h1 className={"main-text"} style={{ color: "white" }}>{element.content?.title}</h1>
                         <p className={"sub-text"} style={{ paddingBottom: "2rem", color: "white" }}>{element.content?.subtitle}</p>
                         <div style={{ width: "80%" }}>
                            <div style={{ width: "100%", paddingBottom: "3rem", display: "flex", flexFlow: "row wrap", justifyContent: "center" }}>
                                {element.content?.buttons?.map((btn: any, idx: number) => (
                                    <a key={idx} href={btn.href} className={"inline-block px-6 py-3 border-2 border-green-700 bg-green-700 rounded-full font-medium hover:bg-transparent hover:border-white hover:text-white transition-colors text-sm md:text-base"} style={{ margin: "0 0.25rem" }}>{btn.text}</a>
                                ))}
                            </div>
                        </div>
                    </div>
                 );
                 break;
             case 'feature-section':
                 elementView = (
                     <div style={{ background: element.content?.bgColor, ...element.style }} className={element.className}>
                        <div className="myContainer v2">
                             <div style = {{width: "45%"}}>
                                 <h2 className="sub-text" style={{ color: "white" }}>{element.content?.title}</h2>
                             </div>
                             <div style = {{width: "45%"}}>
                                 <p style={{ color: "white" }}>{element.content?.description}</p>
                             </div>
                         </div>
                        {element.content?.features && (
                            <div style={{ display: "flex", flexFlow: "row wrap", width: "100%", justifyContent: "center", paddingBottom: "10rem", margin: '0' }}>
                                 {element.content.features.map((feature: any, idx: number) => (
                                     <div key={idx} style={{ width: "30%", display: "flex", flexFlow: "column wrap", justifyContent: "flex-start", padding: '0 1rem' }}>
                                         <h3 className="sub-text v2">{feature.title}</h3>
                                         <p style={{ color: "white", paddingTop: '1rem' }}>{feature.text}</p>
                                     </div>
                                 ))}
                             </div>
                         )}
                    </div>
                );
                 break;
             case 'content-image-split':
                elementView = (
                    <div style={{ background: element.content?.bgColor, ...element.style }} className={element.className}>
                        <div className="myContainer v2">
                             <div style={{ width: "45%", display: "flex", flexFlow: "column wrap", justifyContent: "center", position: "relative" }}>
                                <h2 className="sub-text" style={{ color: "white", fontSize: "2rem" }}>{element.content?.title}</h2>
                                <p style={{ color: "white", paddingTop: "1rem" }}>{element.content?.text}</p>
                             </div>
                             <div style={{ width: "45%" }}>
                                 {element.content?.imageUrl && <img src={element.content.imageUrl} style={{ objectFit: "fill", width: "100%" }} alt="Content Image"/>}
                             </div>
                         </div>
                    </div>
                );
                 break;
            case 'text':
                 elementView = <p style={element.style} className={element.className}>{element.content}</p>;
                 break;
            case 'image': 
                elementView = <img src={element.content?.url} style={element.style} className={element.className} alt={element.content?.alt || ''} />;
                break;
            default:
                elementView = <div className="text-red-500">Unsupported element type: {element.type}</div>;
         }

        if (isEditing) {
             return (
                 <HomeElementEditable
                     key={element.id}
                     item={element}
                     index={index}
                     maxIndex={homeData.elements.length - 1}
                     onEdit={() => startEditingElement(element, index)}
                     onSetIndex={(newIndex) => updateElement(element.id, element.type, element.content, newIndex)}
                     onDelete={() => removeElement(element.id)}
                     disabled={editedElementId !== null && editedElementId !== element.id} 
                 >
                     {elementView}
                 </HomeElementEditable>
             );
         } else {
             return <div key={element.id}>{elementView}</div>;
         }
    };

     const renderAddElementButtons = () => {
         if (!isEditing) return null;

         const defaultHeroContent = { title: "New Hero Title", subtitle: "Hero subtitle.", buttons: [], imageUrl: "" };
         const defaultFeatureSectionContent = { bgColor: "navy", title: "New Feature Section", description: "", features: [] };
         const defaultSplitContent = { bgColor: "black", title: "New Section Title", text: "Section text.", imageUrl: "" };
         const defaultTextContent = "New text paragraph.";
         const defaultImageContent = { url: "", alt: "" };


         return (
             <div className="p-4 mt-6 border-t border-gray-700 space-x-2">
                 <span className="text-white mr-2">Add New Element:</span>
                 <button
                    onClick={() => insertElement('hero', defaultHeroContent, homeData.elements.length)}
                    disabled={editedElementId !== null}
                    className="px-3 py-1 text-sm bg-blue-700 hover:bg-blue-600 text-white rounded disabled:bg-gray-600"
                 >
                     Hero Section
                 </button>
                 <button
                     onClick={() => insertElement('feature-section', defaultFeatureSectionContent, homeData.elements.length)}
                    disabled={editedElementId !== null}
                     className="px-3 py-1 text-sm bg-blue-700 hover:bg-blue-600 text-white rounded disabled:bg-gray-600"
                 >
                     Feature Section
                 </button>
                  <button
                     onClick={() => insertElement('content-image-split', defaultSplitContent, homeData.elements.length)}
                     disabled={editedElementId !== null}
                     className="px-3 py-1 text-sm bg-blue-700 hover:bg-blue-600 text-white rounded disabled:bg-gray-600"
                 >
                     Content/Image Split
                 </button>
                  <button
                     onClick={() => insertElement('text', defaultTextContent, homeData.elements.length)}
                     disabled={editedElementId !== null}
                     className="px-3 py-1 text-sm bg-blue-700 hover:bg-blue-600 text-white rounded disabled:bg-gray-600"
                 >
                     Text Block
                 </button>

             </div>
         );
     };


    if (userAuthLoading) {
        return <div>Loading User...</div>;
    }

    return (
        <div className="flex flex-col flex-1 py-4 space-y-2 bg-gray-900 text-white min-h-screen">
            {loading && <div className="text-center p-4">Loading Content...</div>}
            {error && <div className="text-center p-4 text-red-400 bg-red-900 border border-red-700 rounded">Error: {error}</div>}

             {!loading && !error && (
                <div className="px-4 md:px-6 lg:px-8">
                    {homeData.elements.map((element, index) =>
                        renderElement(element, index, editedElementId === element.id)
                    )}
                 </div>
            )}

             {renderAddElementButtons()}


            {isAdmin && (
                <div className="px-4 md:px-6 lg:px-8 mt-auto pt-4 border-t border-gray-700"> 
                    {isEditing ? (
                        <button
                             onClick={() => {
                                if (editedElementId !== null) {
                                     console.warn("Stopping edit mode with unsaved changes in the editor.");
                                     setEditedElementId(null);
                                     setEditedData(null);
                                 }
                                setIsEditing(false);
                            }}
                            className="px-3 py-1 text-sm bg-orange-700 hover:bg-orange-600 text-white rounded"
                        >
                            Admin: Stop Editing Page
                            {editedElementId !== null && <span className="font-medium ml-1">(Unsaved changes in editor will be lost!)</span>}
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-3 py-1 text-sm bg-orange-700 hover:bg-orange-600 text-white rounded"
                        >
                            Admin: Start Editing Page
                        </button>
                    )}
                </div>
            )}

        </div>
    );
}

export default Home;