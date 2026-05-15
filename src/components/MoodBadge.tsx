import React from 'react';

interface MoodBadgeProps {
  score: number;
}

export default function MoodBadge({ score }: MoodBadgeProps) {
  const getColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-700';
    if (score >= 60) return 'bg-yellow-100 text-yellow-700';
    if (score >= 40) return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
  };

  const getEmoji = (score: number) => {
    if (score >= 80) return '😊';
    if (score >= 60) return '🙂';
    if (score >= 40) return '😐';
    return '😔';
  };

  return (
    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getColor(score)}`}>
      {getEmoji(score)} {score}
    </div>
  );
}
