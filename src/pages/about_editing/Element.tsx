import renderTextWithLinks from "../../common/about/LinkRendering";

function Element({ item }) {
  if (item.type === "h1") {
    return <h1 className="text-3xl px-6">{renderTextWithLinks(item.text)}</h1>;
  } else if (item.type === "h2") {
    return <h2 className="text-2xl px-6">{renderTextWithLinks(item.text)}</h2>;
  } else if (item.type === "h3") {
    return <h3 className="text-xl px-6">{renderTextWithLinks(item.text)}</h3>;
  } else if (item.type === "p") {
    return <p className="text-base px-6">{renderTextWithLinks(item.text)}</p>;
  } else if (item.type === "img") {
    try {
      const { width, url } = JSON.parse(item.text);
      if (typeof width === "number" && typeof url === "string") {
        return (
          <div className="px-6">
            <img
              src={url}
              alt="Image block"
              style={{ width: `${width * 100}%` }}
              className="border border-gray-700"
            />
          </div>
        );
      }
    } catch {
      return <p className="text-base px-6 text-red-400">Invalid image data</p>;
    }
  }

  return null;
}

export default Element;
