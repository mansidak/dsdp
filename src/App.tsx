import React, { useState, useCallback, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Dock from './components/Dock';
import Canvas from './components/Canvas';
import { BlockData } from './constants';
import CustomDragLayer from './components/CustomDragLayer';

interface Connection {
  from: { id: number; side: 'left' | 'right' };
  to: { id: number; side: 'left' | 'right' };
}

const App: React.FC = () => {
  const [blocks, setBlocks] = useState<{ [key: number]: BlockData }>({});
  const nextIdRef = useRef(1);
  const [selectedBlockId, setSelectedBlockId] = useState<number | null>(null);
  const [connectionSelection, setConnectionSelection] = useState<number[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [pendingConnection, setPendingConnection] = useState<{
    id: number;
    side: 'left' | 'right';
  } | null>(null);

  const addBlockToCanvas = useCallback(
    (block: Omit<BlockData, 'id'> & { left: number; top: number }) => {
      setBlocks((prevBlocks) => {
        const id = nextIdRef.current++;
        return { ...prevBlocks, [id]: { ...block, id } };
      });
    },
    []
  );

  const moveBlock = useCallback((id: number, left: number, top: number) => {
    setBlocks((prevBlocks) => ({ ...prevBlocks, [id]: { ...prevBlocks[id], left, top } }));
  }, []);

  const deleteBlock = useCallback((id: number) => {
    setBlocks((prevBlocks) => {
      const newBlocks = { ...prevBlocks };
      delete newBlocks[id];
      return newBlocks;
    });
    setConnections((prevConnections) =>
      prevConnections.filter((conn) => conn.from.id !== id && conn.to.id !== id)
    );
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
    setConnectionSelection((prevSelection) =>
      prevSelection.filter((blockId) => blockId !== id)
    );
  }, [selectedBlockId]);

  const handleBlockClick = useCallback(
    (id: number, event: React.MouseEvent) => {
      event.stopPropagation();
      if (event.shiftKey) {
        setConnectionSelection((prevSelection) => {
          if (prevSelection.includes(id)) {
            return prevSelection;
          } else if (prevSelection.length === 1) {
            const from = prevSelection[0];
            const to = id;
            const exists = connections.some(
              (conn) =>
                (conn.from.id === from && conn.to.id === to) || (conn.from.id === to && conn.to.id === from)
            );
            if (!exists) {
              const newConnection: Connection = {
                from: { id: from, side: 'left' },
                to: { id: to, side: 'left' }
              };
              setConnections(prev => [...prev, newConnection]);
            }
            return [];
          } else {
            return [id];
          }
        });
        setSelectedBlockId(null);
      } else {
        setSelectedBlockId(id);
        setConnectionSelection([]);
      }
    },
    [connections]
  );

  const handleCanvasClick = useCallback(() => {
    setSelectedBlockId(null);
    setConnectionSelection([]);
  }, []);

  const exportCSV = () => {
    const csvContent = [
      'Type,,Subtype,',
      'From,To,From,To'
    ];
    
    connections.forEach(connection => {
      const fromBlock = blocks[connection.from.id];
      const toBlock = blocks[connection.to.id];
      
      if (fromBlock && toBlock) {
        csvContent.push(
          `${fromBlock.category},${toBlock.category},${fromBlock.name},${toBlock.name}`
        );
      }
    });

    const blob = new Blob([csvContent.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'connections.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDotClick = (blockId: number, side: 'left' | 'right') => {
    if (!pendingConnection) {
      setPendingConnection({ id: blockId, side });
    } else if (pendingConnection.id !== blockId) {
      const exists = connections.some(
        conn => 
          (conn.from.id === pendingConnection.id && conn.to.id === blockId) ||
          (conn.from.id === blockId && conn.to.id === pendingConnection.id)
      );
      
      if (!exists) {
        setConnections(prev => [
          ...prev,
          {
            from: pendingConnection,
            to: { id: blockId, side }
          }
        ]);
      }
      setPendingConnection(null);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', height: '100vh', position: 'relative' }}>
        <CustomDragLayer />
        <Dock />
        <Canvas
          blocks={blocks}
          addBlock={addBlockToCanvas}
          moveBlock={moveBlock}
          selectedBlockId={selectedBlockId}
          connectionSelection={connectionSelection}
          onBlockClick={handleBlockClick}
          onCanvasClick={handleCanvasClick}
          connections={connections}
          deleteBlock={deleteBlock}
          handleDotClick={handleDotClick}
          pendingConnection={pendingConnection}
        />
        <button
          onClick={exportCSV}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Export CSV
        </button>
      </div>
    </DndProvider>
  );
};

export default App;
