import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import trTR from 'antd/es/locale/tr_TR';
import 'dayjs/locale/tr';
import dayjs from 'dayjs';
import { ConfigProvider } from 'antd';
import ReactDOM from 'react-dom/client';
import enUS from 'antd/es/locale/en_US';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <StrictMode>
  //   <App />
  // </StrictMode>,
  <ConfigProvider locale={trTR}>
    <App />
  </ConfigProvider>
)
