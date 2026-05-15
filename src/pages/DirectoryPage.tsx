import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import DiaryCard from '../components/DiaryCard';
import FloatingButtons from '../components/FloatingButtons';
import { searchEntries } from '../storage/diaryStorage';
import { DiaryEntry, SortMode } from '../types/diary';

export default function DirectoryPage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [sortMode, setSortMode] = useState<SortMode>('newest');

  useEffect(() => {
    loadEntries();
  }, [sortMode]);

  const loadEntries = () => {
    const results = searchEntries({
      status: 'archived',
      sortMode,
    });
    setEntries(results);
  };

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">日记目录</h1>
        <select
          value={sortMode}
          onChange={(e) => setSortMode(e.target.value as SortMode)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">从新到旧</option>
          <option value="oldest">从旧到新</option>
        </select>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          还没有日记，快去写一篇吧！
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <DiaryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}

      <FloatingButtons />
    </Layout>
  );
}
