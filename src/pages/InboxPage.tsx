import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import DiaryCard from '../components/DiaryCard';
import FloatingButtons from '../components/FloatingButtons';
import { getInboxEntries, publishEntry, publishAllInbox } from '../storage/diaryStorage';
import { DiaryEntry } from '../types/diary';

export default function InboxPage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    const inboxEntries = getInboxEntries();
    setEntries(inboxEntries);
  };

  const handlePublishOne = (id: string) => {
    publishEntry(id);
    loadEntries();
  };

  const handlePublishAll = () => {
    if (entries.length === 0) return;
    if (confirm(`确定要发送所有 ${entries.length} 封信吗？`)) {
      publishAllInbox();
      loadEntries();
    }
  };

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">📬 收件箱</h1>
        {entries.length > 0 && (
          <button
            onClick={handlePublishAll}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
          >
            一键发送全部
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          收件箱是空的
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry.id} className="relative">
              <DiaryCard entry={entry} />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePublishOne(entry.id);
                }}
                className="absolute top-4 right-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
              >
                投递
              </button>
            </div>
          ))}
        </div>
      )}

      <FloatingButtons />
    </Layout>
  );
}
