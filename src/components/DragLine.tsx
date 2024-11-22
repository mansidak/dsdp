import React from 'react';
import { BlockData } from '../constants';

interface DragLineProps {
  startBlock: BlockData;
  startSide: 'left' | 'right';
  currentPosition: { x: number; y: number };
}

const DragLine: React.FC<DragLineProps> = ({ startBlock, startSide, currentPosition }) => {
  const startX = startBlock.left + (startSide === 'left' ? 0 : 300);
  const startY = startBlock.top + 17.5;

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <line
        x1={startX}
        y1={startY}
        x2={currentPosition.x}
        y2={currentPosition.y}
        stroke="black"
        strokeWidth="2"
        strokeDasharray="5,5"
      />
    </svg>
  );
};

export default DragLine;
