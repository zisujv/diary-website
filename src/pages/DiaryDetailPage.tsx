import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import TagPill from '../components/TagPill';
import MoodBadge from '../components/MoodBadge';
import FloatingButtons from '../components/FloatingButtons';
import { getEntryById, moveToInbox, getPublishedEntries } from '../storage/diaryStorage';
import { DiaryEntry } from '../types/diary';

export default function DiaryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [prevId, setPrevId] = useState<string | null>(null);
  const [nextId, setNextId] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const currentEntry = getEntryById(id);
    setEntry(currentEntry);

    if (currentEntry && currentEntry.status === 'archived') {
      const allPublished = getPublishedEntries().sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`).getTime();
        const dateB = new Date(`${b.date}T${b.time}`).getTime();
        return dateB - dateA;
      });

      const currentIndex = allPublished.findIndex((e) => e.id === id);
      setPrevId(currentIndex > 0 ? allPublished[currentIndex - 1].id : null);
      setNextId(currentIndex < allPublished.length - 1 ? allPublished[currentIndex + 1].id : null);
    }
  }, [id]);

  const handleMoveToInbox = () => {
    if (!id) return;
    moveToInbox(id);
    navigate('/inbox');
  };

  if (!entry) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">日记不存在</p>
          <button
            onClick={() => navigate('/diary')}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            返回目录
          </button>
        </div>
        <FloatingButtons />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-sm text-gray-500 mb-2">
              {entry.date} {entry.dayOfWeek} {entry.time}
            </div>
            <h1 className="text-2xl font-bold text-gray-800">{entry.title}</h1>
          </div>
          <MoodBadge score={entry.moodScore} />
        </div>

        {entry.attachments.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">附件区域（{entry.attachments.length} 个附件）</p>
          </div>
        )}

        <div className="prose max-w-none mb-6">
          <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>
        </div>

        {entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {entry.tags.map((tag) => (
              <TagPill key={tag} tag={tag} />
            ))}
          </div>
        )}

        {entry.moodNote && (
          <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-700">💭 {entry.moodNote}</p>
          </div>
        )}

        {entry.aiSummary && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">📝 AI 总结：{entry.aiSummary}</p>
          </div>
        )}

        {entry.aiComfort && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-700">💌 邮差的话：{entry.aiComfort}</p>
          </div>
        )}

        {entry.status === 'archived' && (
          <div className="flex justify-end pt-4 border-t">
            <button
              onClick={handleMoveToInbox}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            >
              放回收件箱
            </button>
          </div>
        )}
      </div>

      {prevId && (
        <button
          onClick={() => navigate(`/diary/${prevId}`)}
          className="fixed left-6 md:left-10 top-1/2 -translate-y-1/2 p-3 opacity-45 hover:opacity-90 hover:scale-110 transition-all duration-200 cursor-pointer group"
          aria-label="上一篇"
        >
          <div className="w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-r-[16px] border-r-gray-700 group-hover:border-r-gray-900"></div>
        </button>
      )}

      {nextId && (
        <button
          onClick={() => navigate(`/diary/${nextId}`)}
          className="fixed right-6 md:right-10 top-1/2 -translate-y-1/2 p-3 opacity-45 hover:opacity-90 hover:scale-110 transition-all duration-200 cursor-pointer group"
          aria-label="下一篇"
        >
          <div className="w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-l-[16px] border-l-gray-700 group-hover:border-l-gray-900"></div>
        </button>
      )}

      <FloatingButtons />
    </Layout>
  );
}
