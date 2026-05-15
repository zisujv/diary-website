import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DirectoryPage from './pages/DirectoryPage';
import DiaryDetailPage from './pages/DiaryDetailPage';
import NewDiaryPage from './pages/NewDiaryPage';
import InboxPage from './pages/InboxPage';
import SearchPage from './pages/SearchPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/diary" element={<DirectoryPage />} />
        <Route path="/diary/:id" element={<DiaryDetailPage />} />
        <Route path="/new" element={<NewDiaryPage />} />
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
