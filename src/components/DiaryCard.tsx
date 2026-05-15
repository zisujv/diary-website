import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DiaryEntry } from '../types/diary';
import TagPill from './TagPill';
import MoodBadge from './MoodBadge';

interface DiaryCardProps {
  entry: DiaryEntry;
}

export default function DiaryCard({ entry }: DiaryCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/diary/${entry.id}`)}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer border border-gray-200"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="text-sm text-gray-500">
            {entry.date} {entry.dayOfWeek} {entry.time}
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mt-1">{entry.title}</h3>
        </div>
        <MoodBadge score={entry.moodScore} />
      </div>

      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
        {entry.content}
      </p>

      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {entry.tags.map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>
      )}
    </div>
  );
}
