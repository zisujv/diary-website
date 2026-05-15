import React, { useState } from 'react';
import Layout from '../components/Layout';
import DiaryCard from '../components/DiaryCard';
import FloatingButtons from '../components/FloatingButtons';
import { searchEntries } from '../storage/diaryStorage';
import { FIXED_TAGS } from '../data/tags';
import { DiaryEntry, SortMode } from '../types/diary';

export default function SearchPage() {
  const [keyword, setKeyword] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortMode, setSortMode] = useState<SortMode>('relevance');
  const [results, setResults] = useState<DiaryEntry[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSearch = () => {
    const searchResults = searchEntries({
      keyword: keyword.trim(),
      tags: selectedTags,
      searchTitle: true,
      searchContent: true,
      sortMode,
    });
    setResults(searchResults);
    setHasSearched(true);
  };

  const handleReset = () => {
    setKeyword('');
    setSelectedTags([]);
    setSortMode('relevance');
    setResults([]);
    setHasSearched(false);
  };

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">🔍 搜索日记</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              关键词
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索标题或正文..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              标签筛选（可多选）
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
              排序方式
            </label>
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="relevance">按匹配次数从多到少</option>
              <option value="newest">时间从新到旧</option>
              <option value="oldest">时间从旧到新</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSearch}
              className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              搜索
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
            >
              重置
            </button>
          </div>
        </div>
      </div>

      {hasSearched && (
        <div>
          <div className="mb-4 text-gray-600">
            找到 {results.length} 篇日记
          </div>
          {results.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              没有找到匹配的日记
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((entry) => (
                <DiaryCard key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </div>
      )}

      <FloatingButtons />
    </Layout>
  );
}
