import React, { useState } from 'react';
import axios from 'axios';

export default function AddBridgeForm() {
  const [url, setUrl] = useState('');
  const [topic, setTopic] = useState('');
  const [method, setMethod] = useState('GET');
  const [interval, setInterval] = useState(60);
  const [params, setParams] = useState([{ key: '', value: '' }]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const paramsObject = params.reduce((acc, p) => {
      if (p.key) acc[p.key] = p.value;
      return acc;
    }, {} as Record<string, string>);

    await axios.post('/bridges/', {
      name: "manual-bridge-" + Date.now(),
      url,
      method,
      interval,
      mqtt_topic: topic,
      params: paramsObject
    });

    alert('Bridge added');
    setUrl('');
    setTopic('');
    setMethod('GET');
    setInterval(60);
    setParams([{ key: '', value: '' }]);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <h2>Add HTTP to MQTT Bridge</h2>
      <input type="text" placeholder="HTTP URL" value={url} onChange={e => setUrl(e.target.value)} />
      <input type="text" placeholder="MQTT Topic" value={topic} onChange={e => setTopic(e.target.value)} />

      <select value={method} onChange={e => setMethod(e.target.value)}>
        <option>GET</option>
        <option>POST</option>
        <option>PUT</option>
      </select>

      <input
        type="number"
        placeholder="Interval (s)"
        value={interval}
        onChange={e => setInterval(Number(e.target.value))}
      />

      <div>
        <h4>Params</h4>
        {params.map((p, i) => (
          <div key={i}>
            <input
              placeholder="Key"
              value={p.key}
              onChange={e => {
                const updated = [...params];
                updated[i].key = e.target.value;
                setParams(updated);
              }}
            />
            <input
              placeholder="Value"
              value={p.value}
              onChange={e => {
                const updated = [...params];
                updated[i].value = e.target.value;
                setParams(updated);
              }}
            />
            <button type="button" onClick={() => setParams(params.filter((_, idx) => idx !== i))}>🗑️</button>
          </div>
        ))}
        <button type="button" onClick={() => setParams([...params, { key: '', value: '' }])}>➕ Add Param</button>
      </div>

      <button type="submit">Add Bridge</button>
    </form>
  );
}
