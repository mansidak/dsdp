import React, { useState, useCallback, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Dock from './components/Dock';
import Canvas from './components/Canvas';
import { BlockData } from './constants';

const App: React.FC = () => {
  const [blocks, setBlocks] = useState<{ [key: number]: BlockData }>({});
  const nextIdRef = useRef(1);
  const [selectedBlockId, setSelectedBlockId] = useState<number | null>(null);
  const [connectionSelection, setConnectionSelection] = useState<number[]>([]);
  const [connections, setConnections] = useState<{ from: number; to: number }[]>([]);

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
      prevConnections.filter((conn) => conn.from !== id && conn.to !== id)
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
                (conn.from === from && conn.to === to) || (conn.from === to && conn.to === from)
            );
            if (!exists) {
              const newConnection = { from: from, to: to };
              setConnections((prevConnections) => [...prevConnections, newConnection]);
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

  const exportCSV = useCallback(() => {
    const categoryCounts: { [category: string]: number } = {};
    const blockRows = [['ID', 'Name', 'Category', 'Color', 'Left', 'Top']];
    Object.values(blocks).forEach((block) => {
      categoryCounts[block.category] = (categoryCounts[block.category] || 0) + 1;
      blockRows.push([
        block.id.toString(),
        block.name,
        block.category,
        block.color,
        block.left.toString(),
        block.top.toString(),
      ]);
    });

    const connectionRows = [['From ID', 'To ID']];
    connections.forEach((conn) => {
      connectionRows.push([conn.from.toString(), conn.to.toString()]);
    });

    let csvContent = 'Category,Count\n';
    Object.entries(categoryCounts).forEach(([category, count]) => {
      csvContent += `${category},${count}\n`;
    });

    csvContent += '\nBlocks\n';
    csvContent += blockRows.map((row) => row.join(',')).join('\n');

    csvContent += '\n\nConnections\n';
    csvContent += connectionRows.map((row) => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'blocks.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [blocks, connections]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', height: '100vh', position: 'relative' }}>
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
