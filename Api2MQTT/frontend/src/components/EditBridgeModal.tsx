import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Props {
  bridge: any;
  setBridge: (b: any) => void;
  onCancel: () => void;
}

function objectToArray(obj: Record<string, string>) {
  return Object.entries(obj || {}).map(([key, value]) => ({ key, value }));
}

function arrayToObject(arr: { key: string; value: string }[]) {
  return arr.reduce((acc, curr) => {
    if (curr.key) acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);
}

export default function EditBridgeModal({ bridge, setBridge, onCancel }: Props) {
  const route = bridge.mqtt_topic ? '' : '/mqtt-to-http';

  const [paramList, setParamList] = useState(objectToArray(bridge.params));
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    setBridge({ ...bridge, params: arrayToObject(paramList) });
  }, [paramList]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      axios.put(`/bridges${route}/${bridge.name}`, bridge)
        .then(() => {
          setError(null);
          setLastSaved(new Date());
        })
        .catch((e) => {
          console.error(e);
          setError("❌ Échec de la sauvegarde automatique");
        });
    }, 500);
    return () => clearTimeout(timeout);
  }, [bridge]);

  return (
    <div style={{ border: "1px solid black", padding: 20, background: "#eee" }}>
      <h3>Edit {bridge.name}</h3>

      <input
        placeholder="URL"
        value={bridge.url}
        onChange={e => setBridge({ ...bridge, url: e.target.value })}
      />

      <input
        placeholder="MQTT Topic"
        value={bridge.mqtt_topic || bridge.topic}
        onChange={e =>
          setBridge({
            ...bridge,
            mqtt_topic: bridge.mqtt_topic ? e.target.value : undefined,
            topic: bridge.topic ? e.target.value : undefined
          })
        }
      />

      <select
        value={bridge.method}
        onChange={e => setBridge({ ...bridge, method: e.target.value })}
      >
        <option>GET</option>
        <option>POST</option>
        <option>PUT</option>
      </select>

      {bridge.interval !== undefined && (
        <input
          type="number"
          placeholder="Interval (s)"
          value={bridge.interval}
          onChange={e => setBridge({ ...bridge, interval: Number(e.target.value) })}
        />
      )}

      {bridge.payload_mapping !== undefined && (
        <input
          type="text"
          placeholder="Payload Mapping"
          value={bridge.payload_mapping}
          onChange={e => setBridge({ ...bridge, payload_mapping: e.target.value })}
        />
      )}

      <div style={{ marginTop: 10 }}>
        <h4>Params</h4>
        {paramList.map((p, i) => (
          <div key={i}>
            <input
              placeholder="Key"
              value={p.key}
              onChange={e => {
                const updated = [...paramList];
                updated[i].key = e.target.value;
                setParamList(updated);
              }}
            />
            <input
              placeholder="Value"
              value={p.value}
              onChange={e => {
                const updated = [...paramList];
                updated[i].value = e.target.value;
                setParamList(updated);
              }}
            />
            <button onClick={() => setParamList(paramList.filter((_, idx) => idx !== i))}>🗑️</button>
          </div>
        ))}
        <button onClick={() => setParamList([...paramList, { key: '', value: '' }])}>➕ Add Param</button>
      </div>

      <button onClick={onCancel}>Close</button>

      {lastSaved && (
        <div style={{ color: "green", marginTop: 10 }}>
          ✅ Auto-saved at {lastSaved.toLocaleTimeString()}
        </div>
      )}
      {error && (
        <div style={{ color: "red", marginTop: 10 }}>
          {error}
        </div>
      )}
    </div>
  );
}
