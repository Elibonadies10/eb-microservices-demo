import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import axios from 'axios';

function App() {
  const [pythonMessage, setPythonMessage] = useState('');
  const [javaMessage, setJavaMessage] = useState('');
  const [pythonToJavaMessage, setPythonToJavaMessage] = useState('');
  const [javaToPythonMessage, setJavaToPythonMessage] = useState('');

  const callPythonService = async () => {
    try {
      const response = await axios.get('/api/python/hello');
      setPythonMessage(response.data);
    } catch (error) {
      console.error('Error calling Python service:', error);
      setPythonMessage('Error calling Python service');
    }
  };

  const callJavaService = async () => {
    try {
      const response = await axios.get('/api/java/hello');
      setJavaMessage(response.data);
    } catch (error) {
      console.error('Error calling Java service:', error);
      setJavaMessage('Error calling Java service');
    }
  };

  const callJavaFromPython = async () => {
    try {
      const response = await axios.get('/api/python/call-java');
      setPythonToJavaMessage(response.data);
    } catch (error) {
      console.error('Error calling Java from Python:', error);
      setPythonToJavaMessage('Error calling Java from Python');
    }
  };

  const callPythonFromJava = async () => {
    try {
      const response = await axios.get('/api/java/call-python');
      setJavaToPythonMessage(response.data);
    } catch (error) {
      console.error('Error calling Python from Java:', error);
      setJavaToPythonMessage('Error calling Python from Java');
    }
  };

  return (
    <div className="App">
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/python-error">Python Error Generator</Link>
          </li>
          <li>
            <Link to="/java-error">Java Error Generator</Link>
          </li>
        </ul>
      </nav>

      <main>
        <h1>Microservices Demo</h1>
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ marginBottom: '20px' }}>
            <h2>Python Service</h2>
            <button onClick={callPythonService} style={{ marginRight: '10px' }}>Call Python Service</button>
            <button onClick={callJavaFromPython}>Call Java from Python</button>
            <p>{pythonMessage}</p>
            <p>{pythonToJavaMessage}</p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h2>Java Service</h2>
            <button onClick={callJavaService} style={{ marginRight: '10px' }}>Call Java Service</button>
            <button onClick={callPythonFromJava}>Call Python from Java</button>
            <p>{javaMessage}</p>
            <p>{javaToPythonMessage}</p>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
