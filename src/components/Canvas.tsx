import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes, BlockData } from '../constants';
import DraggableBlock from './DraggableBlock';
import Connections from './Connections';

interface CanvasProps {
  blocks: { [key: number]: BlockData };
  addBlock: (block: Omit<BlockData, 'id'> & { left: number; top: number }) => void;
  moveBlock: (id: number, left: number, top: number) => void;
  selectedBlockId: number | null;
  connectionSelection: number[];
  onBlockClick: (id: number, event: React.MouseEvent) => void;
  onCanvasClick: () => void;
  connections: { from: number; to: number }[];
  deleteBlock: (id: number) => void;
}

const Canvas: React.FC<CanvasProps> = ({
  blocks,
  addBlock,
  moveBlock,
  selectedBlockId,
  connectionSelection,
  onBlockClick,
  onCanvasClick,
  connections,
  deleteBlock,
}) => {
  const canvasRef = useRef<HTMLDivElement | null>(null);

  const [, drop] = useDrop({
    accept: ItemTypes.BLOCK,
    drop: (item: BlockData & { left?: number; top?: number }, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (clientOffset && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const left = clientOffset.x - rect.left;
        const top = clientOffset.y - rect.top;
        if (blocks[item.id]) {
          moveBlock(item.id, left, top);
        } else {
          addBlock({ ...item, left, top });
        }
      }
    },
  });

  return (
    <div
      ref={(node) => {
        canvasRef.current = node;
        drop(node);
      }}
      onClick={onCanvasClick}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'auto',
      }}
    >
      <Connections blocks={blocks} connections={connections} />
      {Object.values(blocks).map((block) => (
        <DraggableBlock
          key={block.id}
          {...block}
          moveBlock={moveBlock}
          onClick={onBlockClick}
          selected={selectedBlockId === block.id}
          connectionSelected={connectionSelection.includes(block.id)}
          deleteBlock={deleteBlock}
        />
      ))}
    </div>
  );
};

export default Canvas;
