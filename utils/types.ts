// utils/types.ts
export interface ImageProps {
  id: number;
  src: string;
  width: number;
  height: number;
  blurDataUrl?: string;
  folderName?: string;
  computer?: number; 
  difficulty?: number;
  tags?: string[];
}

