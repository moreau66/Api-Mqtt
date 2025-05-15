import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface Props {
  bridge: any;
  onEdit: () => void;
  onDelete: () => void;
}

export default function BridgeCard({ bridge, onEdit, onDelete }: Props) {
  return (
    <div style={{ border: "1px solid #ccc", margin: "8px", padding: "8px" }}>
      <strong>{bridge.name}</strong>
      <div>URL: {bridge.url}</div>
      <div>Topic: {bridge.mqtt_topic || bridge.topic}</div>
      <button onClick={onEdit}><FaEdit /> Edit</button>
      <button onClick={onDelete}><FaTrash /> Delete</button>
    </div>
  );
}
