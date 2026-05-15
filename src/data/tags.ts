/**
 * Puppy Diary Web - 固定标签列表
 * 不允许随意新增标签
 */

import { DiaryTag } from '../types/diary';

/**
 * 固定标签列表（不允许用户自定义）
 */
export const FIXED_TAGS: readonly DiaryTag[] = [
  '日常',
  '家人',
  '朋友',
  '社交',
  '感情',
  '学业',
  '工作',
  '成长',
  '心灵',
  '情绪',
  '焦虑',
  '开心',
  '低落',
  '孤独',
  '回忆',
  '旅行',
  '身体',
  '目标',
  '反思',
  '灵感',
  '待整理',
] as const;

/**
 * 验证标签是否在固定标签列表中
 */
export function isValidTag(tag: string): tag is DiaryTag {
  return FIXED_TAGS.includes(tag as DiaryTag);
}

/**
 * 过滤出有效的标签
 */
export function filterValidTags(tags: string[]): DiaryTag[] {
  return tags.filter(isValidTag);
}
