import React from 'react';

export interface CanvasOffset {
  x: number;
  y: number;
}

export const CanvasOffsetContext = React.createContext<CanvasOffset>({ x: 0, y: 0 });