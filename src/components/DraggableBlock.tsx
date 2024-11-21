import React, { useRef, useState, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes, Connection } from '../constants';
import Block from './Block';

interface DraggableBlockProps {
  id: number;
  category: string;
  color: string;
  name: string;
  left: number;
  top: number;
  moveBlock: (id: number, left: number, top: number) => void;
  onClick: (id: number, event: React.MouseEvent) => void;
  selected: boolean;
  connectionSelected: boolean;
  deleteBlock: (id: number) => void;
  onDotClick: (blockId: number, side: 'left' | 'right') => void;
  pendingConnection: { id: number; side: 'left' | 'right' } | null;
  connections: Connection[];
}

const DraggableBlock: React.FC<DraggableBlockProps> = ({
  id,
  category,
  color,
  name,
  left,
  top,
  moveBlock,
  onClick,
  selected,
  connectionSelected,
  deleteBlock,
  onDotClick,
  pendingConnection,
  connections,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.BLOCK,
    item: { id, category, color, name, left, top },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta) {
        moveBlock(id, left + delta.x, top + delta.y);
      }
    },
    options: {
      dropEffect: 'move'
    },
    previewOptions: {
      captureDraggingState: true,
    }
  });

  // Disable the default drag preview
  useEffect(() => {
    preview(null);
  }, [preview]);

  const [showDots, setShowDots] = useState(false);
  const [dotsLocked, setDotsLocked] = useState(false);

  useEffect(() => {
    if (pendingConnection) {
      setDotsLocked(true);
      setShowDots(true);
    } else {
      setDotsLocked(false);
    }
  }, [pendingConnection]);

  drag(ref);
  return (
    <div
      ref={ref}
      onMouseEnter={() => !dotsLocked && setShowDots(true)}
      onMouseLeave={() => !dotsLocked && setShowDots(false)}
      onClick={(e) => {
        e.stopPropagation();
        onClick(id, e);
      }}
      style={{
        position: 'absolute',
        left: left,
        top: top,
        cursor: 'move',
        opacity: isDragging ? 0 : 1,
        border: connectionSelected ? '2px dashed black' : 'none',
        display: isDragging ? 'none' : 'block',
      }}
    >
      {selected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteBlock(id);
          }}
          style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            background: 'red',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            cursor: 'pointer',
          }}
        >
          x
        </button>
      )}
      <Block 
        id={id}
        color={color} 
        name={name} 
        category={category}
        showDots={!isDragging && showDots}
        onDotClick={(side) => onDotClick(id, side as 'left' | 'right')}
        pendingConnection={pendingConnection}
        connections={connections}
      />
    </div>
  );
};

export default DraggableBlock;