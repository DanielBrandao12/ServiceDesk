import React from "react";
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "./utils/configContext/index.tsx";

createRoot(document.getElementById('root')!).render(
    <ConfigProvider>


   <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
    </ConfigProvider>,
)
