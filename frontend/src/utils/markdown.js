import { marked } from 'marked';
import DOMPurify from 'dompurify';

export const renderMarkdown = (markdownString) => {
  const rawHtml = marked.parse(markdownString);
  return DOMPurify.sanitize(rawHtml);
};
