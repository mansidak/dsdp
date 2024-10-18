import React from 'react';

interface BlockProps {
  color: string;
  name: string;
}

const colorMap: { [key: string]: string } = {
  "Pink": "#FFC0CB",
  "Light Blue": "#ADD8E6",
  "Purple": "#800080",
  "Blue": "#0000FF",
  "Green": "#008000",
  // Add more colors as needed
};

const Block: React.FC<BlockProps> = ({ color, name }) => {
  const hexColor = colorMap[color] || "#000000"; // Default to black if color not found

  return (
    <div
      style={{
        width: '150px',
        height: '40px',
        backgroundColor: 'white',
        border: `2px solid ${hexColor}`,
        color: 'black',
        display: 'flex',
        padding: '5px',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '10px',
        textAlign: 'center',
        fontFamily: 'Inter, sans-serif',
        fontSize: '14px',
        userSelect: 'none',
      }}
    >
      {name}
    </div>
  );
};

export default Block;
