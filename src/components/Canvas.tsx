import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes, BlockData, Connection } from '../constants';
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
  connections: Connection[];
  deleteBlock: (id: number) => void;
  handleDotClick: (blockId: number, side: 'left' | 'right') => void;
  pendingConnection: { id: number; side: 'left' | 'right' } | null;
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
  handleDotClick,
  pendingConnection,
}) => {
  const canvasRef = useRef<HTMLDivElement | null>(null);

  const [, drop] = useDrop({
    accept: ItemTypes.BLOCK,
    drop: (item: BlockData & { left?: number; top?: number }, monitor) => {
      const clientOffset = monitor.getClientOffset();
      const initialClientOffset = monitor.getInitialClientOffset();
      const initialSourceClientOffset = monitor.getInitialSourceClientOffset();
      
      if (clientOffset && initialClientOffset && initialSourceClientOffset && canvasRef.current) {
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const canvasScrollLeft = canvasRef.current.scrollLeft;
        const canvasScrollTop = canvasRef.current.scrollTop;

        if (item.id && blocks[item.id]) {
          // For existing blocks, use delta
          const delta = monitor.getDifferenceFromInitialOffset();
          if (delta) {
            const newLeft = item.left! + delta.x;
            const newTop = item.top! + delta.y;
            moveBlock(item.id, newLeft, newTop);
          }
        } else {
          // For new blocks from dock
          const mouseOffset = {
            x: initialClientOffset.x - initialSourceClientOffset.x,
            y: initialClientOffset.y - initialSourceClientOffset.y,
          };
          
          const left = clientOffset.x - canvasRect.left + canvasScrollLeft - mouseOffset.x;
          const top = clientOffset.y - canvasRect.top + canvasScrollTop - mouseOffset.y;
          
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
        backgroundColor: '#f5f5f5'
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
          onDotClick={handleDotClick}
          pendingConnection={pendingConnection}
          connections={connections}
        />
      ))}
    </div>
  );
};

export default Canvas;
