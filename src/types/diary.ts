/**
 * Puppy Diary Web - 类型定义
 * 定义日记、附件、标签等核心数据结构
 */

/**
 * 附件类型
 */
export type AttachmentType = 'image' | 'audio' | 'video' | 'file';

/**
 * 日记状态
 */
export type DiaryStatus = 'inbox' | 'archived';

/**
 * 排序模式
 */
export type SortMode = 'newest' | 'oldest' | 'relevance';

/**
 * 附件数据结构
 */
export interface DiaryAttachment {
  id: string;
  type: AttachmentType;
  url: string;
  name: string;
  size?: number;
  mimeType?: string;
}

/**
 * 日记条目数据结构
 */
export interface DiaryEntry {
  id: string;
  date: string;
  time: string;
  dayOfWeek: string;
  title: string;
  content: string;
  tags: string[];
  moodScore: number;
  moodNote?: string;
  attachments: DiaryAttachment[];
  status: DiaryStatus;
  aiSummary?: string;
  aiComfort?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 标签类型（固定标签）
 */
export type DiaryTag =
  | '日常'
  | '家人'
  | '朋友'
  | '社交'
  | '感情'
  | '学业'
  | '工作'
  | '成长'
  | '心灵'
  | '情绪'
  | '焦虑'
  | '开心'
  | '低落'
  | '孤独'
  | '回忆'
  | '旅行'
  | '身体'
  | '目标'
  | '反思'
  | '灵感'
  | '待整理';

/**
 * 心情信息
 */
export interface MoodInfo {
  score: number;
  note?: string;
}

/**
 * 搜索选项
 */
export interface SearchOptions {
  keyword?: string;
  tags?: string[];
  searchTitle?: boolean;
  searchContent?: boolean;
  sortMode?: SortMode;
  status?: DiaryStatus;
}

/**
 * localStorage 存储格式
 */
export interface DiaryStorage {
  entries: DiaryEntry[];
  lastUpdated: string;
}
