function Element({ item }) {
  return (
    <div className="pl-6">
      {item.type === "h1" && <h1 className="text-3xl">{item.text}</h1>}
      {item.type === "h2" && <h2 className="text-2xl">{item.text}</h2>}
      {item.type === "h3" && <h3 className="text-xl">{item.text}</h3>}
      {item.type === "p" && <p className="text-base">{item.text}</p>}
    </div>
  );
}

export default Element;
