import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function BridgeList() {
  const [bridges, setBridges] = useState<any>(null);

  useEffect(() => {
    axios.get('/bridges/')
      .then(res => setBridges(res.data))
      .catch(err => console.error('Erreur API:', err));
  }, []);

  if (!bridges) return <div>Chargement...</div>;

  return (
    <div style={{ marginTop: 30 }}>
      <h2 style={{ color: '#007bff' }}>HTTP → MQTT Bridges</h2>
      {bridges.http_to_mqtt && bridges.http_to_mqtt.length > 0 ? (
        bridges.http_to_mqtt.map((b: any) => (
          <div key={b.name} style={{ background: '#eef', padding: 10, margin: '10px 0' }}>
            <strong>{b.name}</strong><br />
            <small>🔗 URL: {b.url}</small><br />
            <small>🟢 Topic MQTT: {b.mqtt_topic}</small><br />
            <small>⏱️ Intervalle: {b.interval}s</small><br />
            <small>📡 Méthode HTTP: {b.method}</small>
          </div>
        ))
      ) : (
        <p>Aucun bridge HTTP → MQTT.</p>
      )}

      <h2 style={{ color: '#e67e22' }}>MQTT → HTTP Bridges</h2>
      {bridges.mqtt_to_http && bridges.mqtt_to_http.length > 0 ? (
        bridges.mqtt_to_http.map((b: any) => (
          <div key={b.name} style={{ background: '#ffe9d6', padding: 10, margin: '10px 0' }}>
            <strong>{b.name}</strong><br />
            <small>📥 Topic MQTT: {b.topic}</small><br />
            <small>🔗 URL: {b.url}</small><br />
            <small>📡 Méthode HTTP: {b.method}</small><br />
            <small>🧠 Mapping: {b.payload_mapping}</small>
          </div>
        ))
      ) : (
        <p>Aucun bridge MQTT → HTTP.</p>
      )}
    </div>
  );
}
