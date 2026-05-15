import React from 'react';

interface TagPillProps {
  tag: string;
}

export default function TagPill({ tag }: TagPillProps) {
  return (
    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
      {tag}
    </span>
  );
}
