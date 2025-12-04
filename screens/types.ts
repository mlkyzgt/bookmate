export interface Book {
  id: string;
  title: string;
  authors: string[];
  thumbnail: string;
  description?: string;
  pageCount?: number;
  startDate?: string;
  progress?: number;
  quotes?: string[];
}
