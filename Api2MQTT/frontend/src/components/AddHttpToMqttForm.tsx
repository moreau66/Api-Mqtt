import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Modal';

export default function AddHttpToMqttForm() {
  const [url, setUrl] = useState('');
  const [topic, setTopic] = useState('');
  const [method, setMethod] = useState('GET');
  const [interval, setInterval] = useState(60);
  const [params, setParams] = useState([{ key: '', value: '' }]);
  const [responseModal, setResponseModal] = useState<string | null>(null);
  const [finalUrl, setFinalUrl] = useState<string | null>(null);
  const [testSucceeded, setTestSucceeded] = useState(false);

  const getParamsObject = () => Object.fromEntries(params.filter(p => p.key).map(p => [p.key, p.value]));

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const paramsObject = getParamsObject();

    await axios.post('/bridges/', {
      name: "http2mqtt-" + Date.now(),
      url,
      method,
      interval,
      mqtt_topic: topic,
      params: paramsObject
    });

    alert('✅ HTTP → MQTT Bridge ajouté !');
    setUrl('');
    setTopic('');
    setMethod('GET');
    setInterval(60);
    setParams([{ key: '', value: '' }]);
    setFinalUrl(null);
    setResponseModal(null);
    setTestSucceeded(false);
  };

  const testRequest = async () => {
    const testUrl = url.replace(/\{(\w+)\}/g, (_, key) =>
      params.find(p => p.key === key)?.value || `{${key}}`
    );
    setFinalUrl(testUrl);

    try {
      const res = await axios.get(`/http/request?url=${encodeURIComponent(testUrl)}`);
      setResponseModal(JSON.stringify(res.data, null, 2));
      setTestSucceeded(true);
    } catch (err: any) {
      setResponseModal('❌ Erreur HTTP : ' + err.message);
      setTestSucceeded(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
      <h2>Add HTTP → MQTT Bridge</h2>

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

      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button type="button" onClick={testRequest} style={{ backgroundColor: '#28a745' }}>
          🔍 Tester la requête
        </button>

        {testSucceeded && (
          <button type="button" onClick={() => handleSubmit()} style={{ backgroundColor: '#007bff' }}>
            💾 Ajouter ce test comme bridge
          </button>
        )}
      </div>

      {finalUrl && (
        <div style={{ marginTop: 10 }}>
          <small><strong>Requête envoyée :</strong> {finalUrl}</small>
        </div>
      )}

      {responseModal && <Modal title="Réponse du test HTTP" content={responseModal} onClose={() => setResponseModal(null)} />}
    </form>
  );
}
