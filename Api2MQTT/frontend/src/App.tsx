import React from 'react';
import Navbar from './components/Navbar';
import BridgeList from './components/BridgeList';
import AddHttpToMqttForm from './components/AddHttpToMqttForm';
import AddMqttToHttpForm from './components/AddMqttToHttpForm';

export default function App() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: 20 }}>
        <AddHttpToMqttForm />
        <AddMqttToHttpForm />
        <BridgeList />
      </div>
    </div>
  );
}
