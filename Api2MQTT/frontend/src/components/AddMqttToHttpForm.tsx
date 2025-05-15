import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Modal';

export default function AddMqttToHttpForm() {
  const [topic, setTopic] = useState('');
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('PUT');
  const [payloadMapping, setPayloadMapping] = useState('raw');
  const [testBody, setTestBody] = useState('{\n  "toggle": true\n}');
  const [params, setParams] = useState([{ key: '', value: '' }]);
  const [responseModal, setResponseModal] = useState<string | null>(null);
  const [finalRequest, setFinalRequest] = useState<string | null>(null);
  const [testSucceeded, setTestSucceeded] = useState(false);

  const getParamsObject = () => Object.fromEntries(params.filter(p => p.key).map(p => [p.key, p.value]));

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const paramsObject = getParamsObject();

    await axios.post('/bridges/mqtt-to-http', {
      name: "mqtt2http-" + Date.now(),
      topic,
      url,
      method,
      payload_mapping: payloadMapping,
      params: paramsObject
    });

    alert('✅ MQTT → HTTP Bridge ajouté !');
    setTopic('');
    setUrl('');
    setMethod('PUT');
    setPayloadMapping('raw');
    setTestBody('{\n  "toggle": true\n}');
    setParams([{ key: '', value: '' }]);
    setFinalRequest(null);
    setResponseModal(null);
    setTestSucceeded(false);
  };

  const testSend = async () => {
    const testUrl = url.replace(/\{(\w+)\}/g, (_, key) =>
      params.find(p => p.key === key)?.value || `{${key}}`
    );

    try {
      const bodyData = JSON.parse(testBody);
      setFinalRequest(`${method} ${testUrl}\n\n${JSON.stringify(bodyData, null, 2)}`);

      const res = await axios({ method, url: testUrl, data: bodyData });
      setResponseModal(JSON.stringify(res.data, null, 2));
      setTestSucceeded(true);
    } catch (err: any) {
      setResponseModal('❌ Erreur d’envoi : ' + (err.response?.data || err.message));
      setTestSucceeded(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
      <h2>Add MQTT → HTTP Bridge</h2>

      <input type="text" placeholder="MQTT Topic" value={topic} onChange={e => setTopic(e.target.value)} />
      <input type="text" placeholder="HTTP URL" value={url} onChange={e => setUrl(e.target.value)} />

      <select value={method} onChange={e => setMethod(e.target.value)}>
        <option>PUT</option>
        <option>POST</option>
      </select>

      <input
        type="text"
        placeholder="Payload Mapping"
        value={payloadMapping}
        onChange={e => setPayloadMapping(e.target.value)}
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

      <textarea
        rows={5}
        style={{ width: "100%", marginTop: 10 }}
        value={testBody}
        onChange={e => setTestBody(e.target.value)}
        placeholder='Corps JSON du test (ex. {"toggle": true})'
      />

      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button type="button" onClick={testSend} style={{ backgroundColor: '#28a745' }}>
          🔄 Tester l’envoi
        </button>

        {testSucceeded && (
          <button type="button" onClick={() => handleSubmit()} style={{ backgroundColor: '#007bff' }}>
            💾 Ajouter ce test comme bridge
          </button>
        )}
      </div>

      {finalRequest && (
        <div style={{ marginTop: 10 }}>
          <small><strong>Requête envoyée :</strong></small>
          <pre style={{ background: '#f0f0f0', padding: 10 }}>{finalRequest}</pre>
        </div>
      )}

      {responseModal && <Modal title="Réponse du test MQTT → HTTP" content={responseModal} onClose={() => setResponseModal(null)} />}
    </form>
  );
}
