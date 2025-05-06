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
  const [javaToPythonMessage, setJavaToPythonMessage] = useState('');
  const [pythonToJavaMessage, setPythonToJavaMessage] = useState('');
  const [isLoadingJavaToPython, setIsLoadingJavaToPython] = useState(false);
  const [isLoadingPythonToJava, setIsLoadingPythonToJava] = useState(false);
  const [pythonError, setPythonError] = useState('');
  const [javaError, setJavaError] = useState('');

  const generatePythonError = async () => {
    setIsLoadingPython(true);
    setPythonError('');
    try {
      await fetch('/api/python/generate-error');
    } catch (error) {
      if (error instanceof Error) {
        setPythonError(error.message);
      } else {
        setPythonError('An error occurred in Python service');
      }
      console.error("Python Error occurred:", error);
    } finally {
      setIsLoadingPython(false);
    }
  };

  const generateJavaError = async () => {
    setIsLoadingJava(true);
    setJavaError('');
    try {
      await fetch('/api/java/generate-error');
    } catch (error) {
      if (error instanceof Error) {
        setJavaError(error.message);
      } else {
        setJavaError('An error occurred in Java service');
      }
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

  const callJavaToPython = async () => {
    setIsLoadingJavaToPython(true);
    try {
      const response = await axios.get<ServiceResponse>('/api/java/call-python');
      setJavaToPythonMessage(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error in Java to Python call:', axiosError);
      setJavaToPythonMessage('Error in Java to Python service call');
    } finally {
      setIsLoadingJavaToPython(false);
    }
  };

  const callPythonToJava = async () => {
    setIsLoadingPythonToJava(true);
    try {
      const response = await axios.get<ServiceResponse>('/api/python/call-java');
      setPythonToJavaMessage(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error in Python to Java call:', axiosError);
      setPythonToJavaMessage('Error in Python to Java service call');
    } finally {
      setIsLoadingPythonToJava(false);
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
              {pythonError && (
                <p style={{ 
                  color: '#E76F51', 
                  backgroundColor: '#FDECEA',
                  padding: '10px',
                  borderRadius: '4px',
                  marginTop: '10px'
                }}>
                  {pythonError}
                </p>
              )}
            </div>
            <div style={{ marginTop: '20px' }}>
              <ActionButton 
                onClick={generateJavaError} 
                label="Generate Java Error" 
                color="#E76F51"
                isLoading={isLoadingJava}
              />
              {javaError && (
                <p style={{ 
                  color: '#E76F51', 
                  backgroundColor: '#FDECEA',
                  padding: '10px',
                  borderRadius: '4px',
                  marginTop: '10px'
                }}>
                  {javaError}
                </p>
              )}
            </div>
          </div>

          {/* Inter-service Communication Section */}
          <div className="section" style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#264653', marginBottom: '20px' }}>Inter-service Communication</h2>
            <div>
              <ActionButton 
                onClick={callJavaToPython} 
                label="Java → Python Call" 
                color="#264653"
                isLoading={isLoadingJavaToPython}
              />
              <p>{javaToPythonMessage}</p>
            </div>
            <div style={{ marginTop: '20px' }}>
              <ActionButton 
                onClick={callPythonToJava} 
                label="Python → Java Call" 
                color="#264653"
                isLoading={isLoadingPythonToJava}
              />
              <p>{pythonToJavaMessage}</p>
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
