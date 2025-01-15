import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { initializeFaro, ReactIntegration, getWebInstrumentations, withFaroRouterInstrumentation } from '@grafana/faro-react';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';
import App from './App';

// Initialize Faro before the app renders
initializeFaro({
  url: 'https://faro-collector-prod-us-central-0.grafana.net/collect/9ed1d991dedd20c087870f40c61956b7',
  app: {
    name: 'Microservices',
    version: '1.0.0',
    environment: 'production'
  },
  instrumentations: [
    ...getWebInstrumentations(),
    new TracingInstrumentation(),
    new ReactIntegration(),
  ],
});

// Error generation functions
const generatePythonError = async () => {
    try {
        await fetch('/api/python/generate-error');
    } catch (error) {
        console.error("Python Error occurred:", error);
    }
};

const generateJavaError = async () => {
    try {
        await fetch('/api/java/generate-error');
    } catch (error) {
        console.error("Java Error occurred:", error);
    }
};

// Define your routes
const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "python-error",
        element: <div>
          <h2>Python Error Generator</h2>
          <button onClick={generatePythonError}>Generate Python Error</button>
        </div>
      },
      {
        path: "java-error",
        element: <div>
          <h2>Java Error Generator</h2>
          <button onClick={generateJavaError}>Generate Java Error</button>
        </div>
      }
    ]
  }
];

// Create and instrument the router
const router = createBrowserRouter(routes);
const instrumentedRouter = withFaroRouterInstrumentation(router);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <RouterProvider router={instrumentedRouter} />
  </React.StrictMode>
);
