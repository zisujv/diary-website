import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import TagPill from '../components/TagPill';
import { createEntry, getCurrentDateInfo, getWeekdayFromDate } from '../storage/diaryStorage';
import { FIXED_TAGS } from '../data/tags';
import { DiaryStatus } from '../types/diary';

export default function NewDiaryPage() {
  const navigate = useNavigate();
  const [date, setDate] = useState(getCurrentDateInfo().date);
  const [time, setTime] = useState(getCurrentDateInfo().time);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [moodScore, setMoodScore] = useState(50);
  const [moodNote, setMoodNote] = useState('');
  const [targetStatus, setTargetStatus] = useState<DiaryStatus>('inbox');

  const dayOfWeek = getWeekdayFromDate(date);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (title.length > 25) {
      alert('标题最多 25 个字');
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert('标题和正文不能为空');
      return;
    }

    const newEntry = createEntry({
      date,
      time,
      dayOfWeek,
      title: title.trim(),
      content: content.trim(),
      tags: selectedTags,
      moodScore,
      moodNote: moodNote.trim() || undefined,
      attachments: [],
      status: targetStatus,
    });

    if (targetStatus === 'inbox') {
      navigate('/inbox');
    } else {
      navigate(`/diary/${newEntry.id}`);
    }
  };

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">✏️ 写一封信</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                日期
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                时间
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              星期（自动生成）
            </label>
            <input
              type="text"
              value={dayOfWeek}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              标题（最多 25 字）
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={25}
              placeholder="今天发生了什么..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <div className="text-xs text-gray-500 mt-1">{title.length} / 25</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              正文
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="写下你的心情..."
              rows={10}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              标签（可多选）
            </label>
            <div className="flex flex-wrap gap-2">
              {FIXED_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              心情分数：{moodScore}
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={moodScore}
              onChange={(e) => setMoodScore(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>😔 1</span>
              <span>😊 100</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              心情备注（可选）
            </label>
            <input
              type="text"
              value={moodNote}
              onChange={(e) => setMoodNote(e.target.value)}
              placeholder="简单描述一下心情..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              附件（基础上传）
            </label>
            <input
              type="file"
              multiple
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">附件功能将由附件 Agent 完善</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              投递到
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="inbox"
                  checked={targetStatus === 'inbox'}
                  onChange={(e) => setTargetStatus(e.target.value as DiaryStatus)}
                  className="mr-2"
                />
                收件箱（默认）
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="archived"
                  checked={targetStatus === 'archived'}
                  onChange={(e) => setTargetStatus(e.target.value as DiaryStatus)}
                  className="mr-2"
                />
                直接发布
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              提交
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
