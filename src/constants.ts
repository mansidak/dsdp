export const ItemTypes = {
    BLOCK: 'block',
  };
  
  export interface BlockData {
    id: number;
    category: string;
    color: string;
    name: string;
    left: number;
    top: number;
  }
  
  export interface Connection {
    from: { id: number; side: 'left' | 'right' };
    to: { id: number; side: 'left' | 'right' };
  }
  