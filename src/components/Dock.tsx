import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../constants';
import Block from './Block';

const dockBlocks = [
  { "id": "local-human-operator-agent", "category": "Agent", "color": "Pink", "name": "Local Human Operator" },
  { "id": "remote-human-operator-agent", "category": "Agent", "color": "Pink", "name": "Remote Human Operator" },
  { "id": "predefined-automation-agent", "category": "Agent", "color": "Pink", "name": "Predefined Automation" },
  { "id": "ai-driven-control-agent", "category": "Agent", "color": "Pink", "name": "AI-Driven Control" },
  { "id": "routers-processor", "category": "Processor", "color": "Light Blue", "name": "Routers" },
  { "id": "microcontrollers-processor", "category": "Processor", "color": "Light Blue", "name": "Microcontrollers" },
  { "id": "plcs-processor", "category": "Processor", "color": "Light Blue", "name": "PLCs" },
  { "id": "network-switches-processor", "category": "Processor", "color": "Light Blue", "name": "Network Switches" },
  { "id": "iot-hub-gateway-processor", "category": "Processor", "color": "Light Blue", "name": "IoT Hub/Gateway" },
  { "id": "button-sensor", "category": "Sensor", "color": "Purple", "name": "Button" },
  { "id": "auditory-sensor", "category": "Sensor", "color": "Purple", "name": "Auditory Sensor" },
  { "id": "motion-sensor", "category": "Sensor", "color": "Purple", "name": "Motion Sensor" },
  { "id": "pressure-sensor", "category": "Sensor", "color": "Purple", "name": "Pressure Sensor" },
  { "id": "camera-vision-sensor", "category": "Sensor", "color": "Purple", "name": "Camera/Vision Sensor" },
  { "id": "light-sensor", "category": "Sensor", "color": "Purple", "name": "Light Sensor" },
  { "id": "climate-sensor", "category": "Sensor", "color": "Purple", "name": "Climate Sensor" },
  { "id": "scanning-tracking-sensor", "category": "Sensor", "color": "Purple", "name": "Scanning/Tracking Sensor" },
  { "id": "alarm-actuator", "category": "Actuator", "color": "Blue", "name": "Alarm" },
  { "id": "motor-actuator", "category": "Actuator", "color": "Blue", "name": "Motor (Servo, Hydraulic, Pneumatic)" },
  { "id": "solenoid-actuator", "category": "Actuator", "color": "Blue", "name": "Solenoid" },
  { "id": "climate-actuator", "category": "Actuator", "color": "Blue", "name": "Climate Actuator" },
  { "id": "switches-actuator", "category": "Actuator", "color": "Blue", "name": "Switches" },
  { "id": "tormach-1100mx-machine", "category": "Machine", "color": "Green", "name": "Tormach 1100MX" },
  { "id": "haas-vf-5-40-machine", "category": "Machine", "color": "Green", "name": "Haas VF-5/40" },
  { "id": "okuma-mu8000v-machine", "category": "Machine", "color": "Green", "name": "Okuma MU8000V" }
];


const Dock: React.FC = () => {
  return (
    <div style={{ width: '200px', backgroundColor: '#eee', padding: '10px', overflowY: 'auto' }}>
      {dockBlocks.map((block) => (
        <DockBlock key={block.id} {...block} />
      ))}
    </div>
  );
};

interface DockBlockProps {
  id: string;
  category: string;
  color: string;
  name: string;
}

const DockBlock: React.FC<DockBlockProps> = ({ id, category, color, name }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.BLOCK,
    item: { id, category, color, name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move', marginBottom: '10px' }}
    >
      <Block color={color} name={name} />
    </div>
  );
};

export default Dock;
