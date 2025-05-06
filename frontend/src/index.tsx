import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { initializeFaro, ReactIntegration, getWebInstrumentations } from '@grafana/faro-react';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';
import App from './App';

// Initialize Faro before the app renders
initializeFaro({
  url: 'https://faro-collector-prod-us-central-0.grafana.net/collect/9ed1d991dedd20c087870f40c61956b7',
  app: {
    name: 'Microservices - Frontend',
    version: '1.0.0',
    environment: 'production'
  },
  instrumentations: [
    ...getWebInstrumentations(),
    new TracingInstrumentation(),
    new ReactIntegration(),
  ]
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  }
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
