import React from 'react';
import { BlockData } from '../constants';
import { useDragLayer } from 'react-dnd';

interface ConnectionsProps {
  blocks: { [key: number]: BlockData };
  connections: { from: number; to: number }[];
}

const Connections: React.FC<ConnectionsProps> = ({ blocks, connections }) => {
  const { itemType, isDragging, item, offset } = useDragLayer((monitor) => ({
    itemType: monitor.getItemType(),
    isDragging: monitor.isDragging(),
    item: monitor.getItem(),
    offset: monitor.getDifferenceFromInitialOffset(),
  }));

  const getBlockPosition = (block: BlockData) => {
    if (isDragging && item && item.id === block.id && offset) {
      return {
        left: block.left + offset.x,
        top: block.top + offset.y,
      };
    }
    return { left: block.left, top: block.top };
  };

  return (
    <svg
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      {connections.map((connection, index) => {
        const fromBlock = blocks[connection.from];
        const toBlock = blocks[connection.to];
        if (fromBlock && toBlock) {
          const fromPos = getBlockPosition(fromBlock);
          const toPos = getBlockPosition(toBlock);

          const x1 = fromPos.left + 50;
          const y1 = fromPos.top + 25;
          const x2 = toPos.left + 50;
          const y2 = toPos.top + 25;

          return (
            <line
              key={index}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="black"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          );
        }
        return null;
      })}
    </svg>
  );
};

export default Connections;
