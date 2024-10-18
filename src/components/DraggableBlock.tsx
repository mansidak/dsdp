import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../constants';
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
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging, offset }, drag] = useDrag({
    type: ItemTypes.BLOCK,
    item: { id, category, color, name, left, top },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      offset: monitor.getDifferenceFromInitialOffset(),
    }),
    end: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta) {
        moveBlock(id, left + delta.x, top + delta.y);
      }
    },
  });

  drag(ref);

  const currentLeft = isDragging && offset ? left + offset.x : left;
  const currentTop = isDragging && offset ? top + offset.y : top;

  return (
    <div
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        onClick(id, e);
      }}
      style={{
        position: 'absolute',
        left: currentLeft,
        top: currentTop,
        cursor: 'move',
        opacity: isDragging ? 0.5 : 1,
        border: connectionSelected ? '2px dashed black' : 'none',
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
      <Block color={color} name={name} />
    </div>
  );
};

export default DraggableBlock;
