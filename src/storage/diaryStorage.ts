/**
 * Puppy Diary Web - localStorage 存储层
 * 负责日记数据的增删改查和状态流转
 */

import {
  DiaryEntry,
  DiaryStorage,
  DiaryStatus,
  SearchOptions,
} from '../types/diary';

const STORAGE_KEY = 'puppy_diary_entries';

/**
 * 生成唯一 ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 获取当前日期信息
 */
export function getCurrentDateInfo(): {
  date: string;
  time: string;
  dayOfWeek: string;
} {
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toTimeString().substring(0, 5);
  const dayOfWeek = getWeekdayFromDate(date);
  return { date, time, dayOfWeek };
}

/**
 * 从日期字符串获取星期
 */
export function getWeekdayFromDate(date: string): string {
  const weekdays = [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
  ];
  const d = new Date(date);
  return weekdays[d.getDay()];
}

/**
 * 统计关键词在文本中出现的次数
 */
export function countKeywordOccurrences(text: string, keyword: string): number {
  if (!keyword) return 0;
  const regex = new RegExp(keyword, 'gi');
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

/**
 * 从 localStorage 读取所有日记
 */
function loadStorage(): DiaryStorage {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return { entries: [], lastUpdated: new Date().toISOString() };
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load diary entries:', error);
    return { entries: [], lastUpdated: new Date().toISOString() };
  }
}

/**
 * 保存所有日记到 localStorage
 */
function saveStorage(storage: DiaryStorage): void {
  try {
    storage.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
  } catch (error) {
    console.error('Failed to save diary entries:', error);
  }
}

/**
 * 获取所有日记
 */
export function getAllEntries(): DiaryEntry[] {
  const storage = loadStorage();
  return storage.entries;
}

/**
 * 获取已发布的日记（主目录）
 */
export function getPublishedEntries(): DiaryEntry[] {
  return getAllEntries().filter((entry) => entry.status === 'archived');
}

/**
 * 获取收件箱日记
 */
export function getInboxEntries(): DiaryEntry[] {
  return getAllEntries().filter((entry) => entry.status === 'inbox');
}

/**
 * 根据 ID 获取单篇日记
 */
export function getEntryById(id: string): DiaryEntry | null {
  const entries = getAllEntries();
  return entries.find((entry) => entry.id === id) || null;
}

/**
 * 创建新日记
 */
export function createEntry(
  entry: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>
): DiaryEntry {
  const storage = loadStorage();
  const now = new Date().toISOString();
  const newEntry: DiaryEntry = {
    ...entry,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
  storage.entries.push(newEntry);
  saveStorage(storage);
  return newEntry;
}

/**
 * 更新日记
 */
export function updateEntry(
  id: string,
  patch: Partial<Omit<DiaryEntry, 'id' | 'createdAt'>>
): DiaryEntry | null {
  const storage = loadStorage();
  const index = storage.entries.findIndex((entry) => entry.id === id);
  if (index === -1) return null;

  storage.entries[index] = {
    ...storage.entries[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  saveStorage(storage);
  return storage.entries[index];
}

/**
 * 删除日记
 */
export function deleteEntry(id: string): boolean {
  const storage = loadStorage();
  const index = storage.entries.findIndex((entry) => entry.id === id);
  if (index === -1) return false;

  storage.entries.splice(index, 1);
  saveStorage(storage);
  return true;
}

/**
 * 将日记移至收件箱
 */
export function moveToInbox(id: string): DiaryEntry | null {
  return updateEntry(id, { status: 'inbox' });
}

/**
 * 发布日记（移至主目录）
 */
export function publishEntry(id: string): DiaryEntry | null {
  return updateEntry(id, { status: 'archived' });
}

/**
 * 一键发布所有收件箱日记
 */
export function publishAllInbox(): DiaryEntry[] {
  const inboxEntries = getInboxEntries();
  const published: DiaryEntry[] = [];

  inboxEntries.forEach((entry) => {
    const result = publishEntry(entry.id);
    if (result) {
      published.push(result);
    }
  });

  return published;
}

/**
 * 搜索日记
 */
export function searchEntries(options: SearchOptions = {}): DiaryEntry[] {
  const {
    keyword = '',
    tags = [],
    searchTitle = true,
    searchContent = true,
    sortMode = 'relevance',
    status,
  } = options;

  let entries = getAllEntries();

  // 按状态筛选
  if (status) {
    entries = entries.filter((entry) => entry.status === status);
  }

  // 按标签筛选
  if (tags.length > 0) {
    entries = entries.filter((entry) =>
      tags.some((tag) => entry.tags.includes(tag))
    );
  }

  // 按关键词搜索
  if (keyword) {
    entries = entries.filter((entry) => {
      const titleMatch = searchTitle && entry.title.includes(keyword);
      const contentMatch = searchContent && entry.content.includes(keyword);
      return titleMatch || contentMatch;
    });

    // 按相关性排序（关键词出现次数）
    if (sortMode === 'relevance') {
      entries = entries.map((entry) => {
        const titleCount = searchTitle
          ? countKeywordOccurrences(entry.title, keyword)
          : 0;
        const contentCount = searchContent
          ? countKeywordOccurrences(entry.content, keyword)
          : 0;
        return {
          entry,
          relevance: titleCount * 2 + contentCount, // 标题权重更高
        };
      })
        .sort((a, b) => b.relevance - a.relevance)
        .map((item) => item.entry);
    }
  }

  // 按时间排序
  if (sortMode === 'newest') {
    entries.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`).getTime();
      const dateB = new Date(`${b.date}T${b.time}`).getTime();
      return dateB - dateA;
    });
  } else if (sortMode === 'oldest') {
    entries.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`).getTime();
      const dateB = new Date(`${b.date}T${b.time}`).getTime();
      return dateA - dateB;
    });
  }

  return entries;
}
