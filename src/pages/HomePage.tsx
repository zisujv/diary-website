import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🐕 欢迎来到我的 Diary Web
        </h1>
        <p className="text-gray-600 mb-8">记录生活，温暖陪伴</p>
        <button
          onClick={() => navigate('/diary')}
          className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-lg font-medium transition-colors shadow-lg"
        >
          点击进入
        </button>
      </div>
    </div>
  );
}
