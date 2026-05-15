import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { mockEntries } from './data/mockEntries';

// 初始化 mock 数据
const STORAGE_KEY = 'puppy_diary_entries';
if (!localStorage.getItem(STORAGE_KEY)) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      entries: mockEntries,
      lastUpdated: new Date().toISOString(),
    })
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
