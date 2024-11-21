import React from 'react';
import { Connection } from '../constants';

interface BlockProps {
  id?: number;
  color: string;
  name: string;
  category: string;
  showDots?: boolean;
  onDotClick?: (side: 'left' | 'right', blockId?: number) => void;
  pendingConnection?: { id: number; side: 'left' | 'right' } | null;
  connections?: Connection[];
}

const colorMap: { [key: string]: string } = {
  "Pink": "#FFC0CB",
  "Light Blue": "#ADD8E6",
  "Purple": "#800080",
  "Blue": "#0000FF",
  "Green": "#008000",
};

const Block: React.FC<BlockProps> = ({ 
  id,
  color, 
  name, 
  category, 
  showDots, 
  onDotClick, 
  pendingConnection,
  connections = [] 
}) => {
  const hexColor = colorMap[color] || "#000000";
  const acronym = category.split(' ').map(word => word[0]).join('');

  const isConnectedTo = (otherId: number) => {
    return connections.some(conn => 
      (conn.from.id === id && conn.to.id === otherId) ||
      (conn.from.id === otherId && conn.to.id === id)
    );
  };

  const shouldHighlight = pendingConnection && id 
    ? !isConnectedTo(pendingConnection.id)
    : false;

  return (
    <div
      style={{
        width: '300px',
        height: '35px',
        backgroundColor: 'white',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        color: 'black',
        display: 'flex',
        padding: '5px',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRadius: '10px',
        textAlign: 'left',
        fontFamily: 'Inter, sans-serif',
        fontSize: '14px',
        userSelect: 'none',
        position: 'relative',
      }}
    >
      {showDots && (
        <>
          <div
            onClick={(e) => {
              e.stopPropagation();
              onDotClick?.('left', undefined);
            }}
            style={{
              position: 'absolute',
              left: '-6px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: shouldHighlight ? '#4CAF50' : '#666',
              cursor: 'pointer',
              zIndex: 2,
              transition: 'background-color 0.2s',
              border: '2px solid white'
            }}
          />
          <div
            onClick={(e) => {
              e.stopPropagation();
              onDotClick?.('right', undefined);
            }}
            style={{
              position: 'absolute',
              right: '-6px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: shouldHighlight ? '#4CAF50' : '#666',
              cursor: 'pointer',
              zIndex: 2,
              transition: 'background-color 0.2s',
              border: '2px solid white'
            }}
          />
        </>
      )}
      <div
        style={{
          width: '25px',
          height: '25px',
          backgroundColor: '#e0e0e0',
          borderRadius: '5px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: '10px',
          marginLeft: '5px'
        }}
      >
        {acronym}
      </div>
      {name}
    </div>
  );
};

export default Block;