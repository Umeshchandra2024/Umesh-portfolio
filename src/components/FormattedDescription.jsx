/**
 * Component to format and display project descriptions with:
 * - Headings (# Heading, ## Subheading)
 * - Bullet points (- or *)
 * - Paragraphs (line breaks)
 */
export default function FormattedDescription({ text }) {
  if (!text) return null;

  const formatText = (text) => {
    const lines = text.split('\n');
    const elements = [];
    let currentParagraph = [];
    let listItems = [];

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        elements.push(
          <p key={`p-${elements.length}`} className="formatted-paragraph">
            {currentParagraph.join(' ')}
          </p>
        );
        currentParagraph = [];
      }
    };

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`ul-${elements.length}`} className="formatted-list">
            {listItems.map((item, idx) => (
              <li key={idx} className="formatted-list-item">{item}</li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Empty line
      if (!trimmed) {
        flushList();
        flushParagraph();
        return;
      }

      // Heading level 1 (# Heading)
      if (trimmed.startsWith('# ')) {
        flushList();
        flushParagraph();
        elements.push(
          <h3 key={`h1-${index}`} className="formatted-heading formatted-h1">
            {trimmed.substring(2).trim()}
          </h3>
        );
        return;
      }

      // Heading level 2 (## Subheading)
      if (trimmed.startsWith('## ')) {
        flushList();
        flushParagraph();
        elements.push(
          <h4 key={`h2-${index}`} className="formatted-heading formatted-h2">
            {trimmed.substring(3).trim()}
          </h4>
        );
        return;
      }

      // Bullet point (- or *)
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        flushParagraph();
        const itemText = trimmed.substring(2).trim();
        if (itemText) {
          listItems.push(itemText);
        }
        return;
      }

      // Regular paragraph text
      flushList();
      currentParagraph.push(trimmed);
    });

    // Flush any remaining content
    flushList();
    flushParagraph();

    return elements.length > 0 ? elements : <p className="formatted-paragraph">{text}</p>;
  };

  return <div className="formatted-description">{formatText(text)}</div>;
}
