import { PerformanceRating, performanceThresholds } from '../config/gameConfig';

/**
 * 性能评价器
 * 
 * 根据反应时间计算性能评价等级
 * 
 * 评价标准（满足需求 6.1-6.4）：
 * - 优秀：反应时间 < 200ms
 * - 良好：200ms ≤ 反应时间 < 300ms
 * - 一般：300ms ≤ 反应时间 < 400ms
 * - 需要提高：反应时间 ≥ 400ms
 */

/**
 * 根据反应时间计算性能评价
 * 
 * @param reactionTime - 反应时间（毫秒）
 * @returns 性能评价等级
 * 
 * @example
 * ```typescript
 * calculatePerformanceRating(150);  // 返回 '优秀'
 * calculatePerformanceRating(250);  // 返回 '良好'
 * calculatePerformanceRating(350);  // 返回 '一般'
 * calculatePerformanceRating(450);  // 返回 '需要提高'
 * ```
 */
export function calculatePerformanceRating(reactionTime: number): PerformanceRating {
  if (reactionTime < performanceThresholds.excellent) {
    return '优秀';
  } else if (reactionTime < performanceThresholds.good) {
    return '良好';
  } else if (reactionTime < performanceThresholds.average) {
    return '一般';
  } else {
    return '需要提高';
  }
}
