import React from 'react';
import { BlockData, Connection } from '../constants';
import { useDragLayer } from 'react-dnd';

interface ConnectionsProps {
  blocks: { [key: number]: BlockData };
  connections: Connection[];
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

  const getConnectionPoint = (block: BlockData, side: 'left' | 'right') => {
    const pos = getBlockPosition(block);
    const x = pos.left + (side === 'left' ? 0 : 300);
    const y = pos.top + 17.5;
    return { x, y };
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
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="black" />
        </marker>
      </defs>
      {connections.map((connection, index) => {
        const fromBlock = blocks[connection.from.id];
        const toBlock = blocks[connection.to.id];
        if (fromBlock && toBlock) {
          const fromPoint = getConnectionPoint(fromBlock, connection.from.side);
          const toPoint = getConnectionPoint(toBlock, connection.to.side);

          return (
            <line
              key={index}
              x1={fromPoint.x}
              y1={fromPoint.y}
              x2={toPoint.x}
              y2={toPoint.y}
              stroke="black"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
          );
        }
        return null;
      })}
    </svg>
  );
};

export default Connections;
