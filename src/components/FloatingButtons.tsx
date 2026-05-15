import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function FloatingButtons() {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-3">
      <button
        onClick={() => navigate('/new')}
        className="w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition-colors"
        title="新建日记"
      >
        ✏️
      </button>
      <button
        onClick={() => navigate('/inbox')}
        className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition-colors"
        title="收件箱"
      >
        📬
      </button>
      <button
        onClick={() => navigate('/search')}
        className="w-14 h-14 bg-purple-500 hover:bg-purple-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition-colors"
        title="搜索"
      >
        🔍
      </button>
    </div>
  );
}
