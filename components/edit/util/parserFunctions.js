// Parses [text](url) markdown links into <a> elements for display mode
function parseInlineLinks(text) {
  if (!text || typeof text !== "string" || !text.includes("[")) return text;
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (match) {
      return (
        <a
          key={i}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-dbu-link hover:underline"
        >
          {match[1]}
        </a>
      );
    }
    return part;
  });
}

// Parses __text__ into bold text for display mode.
function parseBoldText(text) {
  if (!text) return text;

  if (Array.isArray(text)) {
    return text.map((part, index) => parseBoldText(part));
  }

  if (typeof text !== "string") return text;

  const parts = [];
  const regex = /__(.+?)__/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    parts.push(
      <span
        key={`${match.index}-${match[0]}`}
        className="font-bold text-dbu-header"
      >
        {match[1]}
      </span>,
    );

    lastIndex = match.index + match[0].length;
  }

  if (parts.length === 0) return text;
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

// Parses *text* into italic text for display mode.
function parseItalicText(text) {
  if (!text) return text;

  if (Array.isArray(text)) {
    return text.map((part, index) => parseItalicText(part));
  }

  if (typeof text !== "string") return text;

  const parts = [];
  const regex = /\*(.+?)\*/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    parts.push(
      <span key={`${match.index}-${match[0]}`} className="italic">
        {match[1]}
      </span>,
    );

    lastIndex = match.index + match[0].length;
  }

  if (parts.length === 0) return text;
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

export function parseAndFormat(value) {
  let valueToBeParsed = value;
  valueToBeParsed = parseInlineLinks(valueToBeParsed);
  valueToBeParsed = parseBoldText(valueToBeParsed);
  valueToBeParsed = parseItalicText(valueToBeParsed);
  return valueToBeParsed;
}
