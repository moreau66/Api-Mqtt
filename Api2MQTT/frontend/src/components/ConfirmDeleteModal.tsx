import React from 'react';

interface Props {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDeleteModal({ name, onConfirm, onCancel }: Props) {
  return (
    <div style={{ background: "#fdd", padding: 20, border: "1px solid red" }}>
      <p>Are you sure you want to delete bridge <strong>{name}</strong>?</p>
      <button onClick={onConfirm}>Yes, delete</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}
