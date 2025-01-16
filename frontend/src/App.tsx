import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import treeLogo from './assets/tree-logo.svg';

interface ServiceResponse {
  message: string;
}

interface ActionButtonProps {
  onClick: () => Promise<void>;
  label: string;
  color: string;
  isLoading?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, label, color, isLoading = false }) => {
  return (
    <button 
      onClick={onClick}
      disabled={isLoading}
      style={{ 
        padding: '8px 16px',
        backgroundColor: color,
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        opacity: isLoading ? 0.7 : 1,
        margin: '5px'
      }}
    >
      {isLoading ? `${label}...` : label}
    </button>
  );
};

// Main App Component
function App() {
  const [pythonMessage, setPythonMessage] = useState('');
  const [javaMessage, setJavaMessage] = useState('');
  const [isLoadingPython, setIsLoadingPython] = useState(false);
  const [isLoadingJava, setIsLoadingJava] = useState(false);
  const [isLoadingTest, setIsLoadingTest] = useState(false);

  const generatePythonError = async () => {
    setIsLoadingPython(true);
    try {
      await fetch('/api/python/generate-error');
    } catch (error) {
      console.error("Python Error occurred:", error);
    } finally {
      setIsLoadingPython(false);
    }
  };

  const generateJavaError = async () => {
    setIsLoadingJava(true);
    try {
      await fetch('/api/java/generate-error');
    } catch (error) {
      console.error("Java Error occurred:", error);
    } finally {
      setIsLoadingJava(false);
    }
  };

  const startLoadTest = async () => {
    setIsLoadingTest(true);
    try {
      const response = await fetch('/api/load-test/start', {
        method: 'POST',
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Failed to start load test:", error);
      alert("Failed to start load test");
    } finally {
      setIsLoadingTest(false);
    }
  };

  const fetchPythonMessage = async () => {
    try {
      const response = await axios.get<ServiceResponse>('/api/python/hello');
      setPythonMessage(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error fetching Python message:', axiosError);
      setPythonMessage('Error fetching message from Python service');
    }
  };

  const fetchJavaMessage = async () => {
    try {
      const response = await axios.get<ServiceResponse>('/api/java/hello');
      setJavaMessage(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error fetching Java message:', axiosError);
      setJavaMessage('Error fetching message from Java service');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f4f4f4'
    }}>
      <main style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '20px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <img src={treeLogo} alt="Tree Logo" style={{ width: '100px', height: '100px' }} />
          <h1 style={{ color: '#264653' }}>Microservices Demo</h1>
        </div>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          padding: '20px'
        }}>
          {/* Service Status Section */}
          <div className="section" style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#264653', marginBottom: '20px' }}>Service Status</h2>
            <div>
              <ActionButton 
                onClick={fetchPythonMessage} 
                label="Check Python Service" 
                color="#2A9D8F"
              />
              <p>{pythonMessage}</p>
            </div>
            <div style={{ marginTop: '20px' }}>
              <ActionButton 
                onClick={fetchJavaMessage} 
                label="Check Java Service" 
                color="#2A9D8F"
              />
              <p>{javaMessage}</p>
            </div>
          </div>

          {/* Error Generation Section */}
          <div className="section" style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#264653', marginBottom: '20px' }}>Error Generation</h2>
            <div>
              <ActionButton 
                onClick={generatePythonError} 
                label="Generate Python Error" 
                color="#E76F51"
                isLoading={isLoadingPython}
              />
            </div>
            <div style={{ marginTop: '20px' }}>
              <ActionButton 
                onClick={generateJavaError} 
                label="Generate Java Error" 
                color="#E76F51"
                isLoading={isLoadingJava}
              />
            </div>
          </div>

          {/* Load Testing Section */}
          <div className="section" style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#264653', marginBottom: '20px' }}>Load Testing</h2>
            <ActionButton 
              onClick={startLoadTest} 
              label="Start Load Test" 
              color="#E9C46A"
              isLoading={isLoadingTest}
            />
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
