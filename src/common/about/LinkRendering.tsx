function renderTextWithLinks(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, i) =>
    urlRegex.test(part) ? (
      <a key={i} href={part} className="underline text-blue-400 hover:text-blue-300" target="_blank" rel="noopener noreferrer">
    {part}
    </a>
) : (
    <span key={i}>{part}</span>
  )
);
}

export default renderTextWithLinks;