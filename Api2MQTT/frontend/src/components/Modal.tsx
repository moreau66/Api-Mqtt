import React from 'react';

interface ModalProps {
  title: string;
  content: string;
  onClose: () => void;
}

export default function Modal({ title, content, onClose }: ModalProps) {
  return (
    <div style={{
      position: 'fixed',
      top: '0', left: '0', right: '0', bottom: '0',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div style={{ background: 'white', padding: 20, width: '80%', maxWidth: 600 }}>
        <h3>{title}</h3>
        <pre style={{ maxHeight: 300, overflow: 'auto', background: '#f0f0f0', padding: 10 }}>{content}</pre>
        <button onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
}
