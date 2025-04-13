import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const htmlToMarkdown = (html: string) => {
  if (!html) return '';
  let markdown = html.replace(/<div>/g, '').replace(/<\/div>/g, '\n');

  markdown = markdown.replace(/<br>/g, '\n');
  markdown = markdown.replace(/&nbsp;/g, ' ');
  markdown = markdown.replace(/&gt;/g, '>');
  markdown = markdown.replace(/&lt;/g, '<');
  markdown = markdown.replace(/&amp;/g, '&');

  return markdown.trim();
};
