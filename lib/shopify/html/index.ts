const BOLD_PARAGRAPH = /<p>\s*<(strong|b)>\s*([^<]+?)\s*<\/\1>\s*<\/p>/g;
const NOT_A_HEADING = /^(last updated\b|\S+@\S+$)/i;

// Staff write section headings as bold paragraphs; render them as h2, but keep date stamps and email lines as text.
export function promoteBoldHeadings(html: string): string {
  return html.replace(BOLD_PARAGRAPH, (paragraph, _tag: string, text: string) =>
    NOT_A_HEADING.test(text) ? paragraph : `<h2>${text}</h2>`,
  );
}
