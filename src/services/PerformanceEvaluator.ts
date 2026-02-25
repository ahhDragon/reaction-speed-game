import { PerformanceRating, performanceThresholds } from '../config/gameConfig';

/**
 * 性能评价器
 * 
 * 根据反应时间计算性能评价等级
 * 
 * 评价标准（7个等级）：
 * - 神级反应：反应时间 < 150ms - 开挂了吧？🤔
 * - 超快反应：150ms ≤ 反应时间 < 200ms - 手速单身30年！💪
 * - 优秀反应：200ms ≤ 反应时间 < 250ms - 稳！👌
 * - 良好反应：250ms ≤ 反应时间 < 320ms - 还不错嘛～😎
 * - 还行吧：320ms ≤ 反应时间 < 420ms - 差点意思～🤏
 * - 有点慢：420ms ≤ 反应时间 < 550ms - 是不是没睡醒？😪
 * - 反应迟钝：反应时间 ≥ 550ms - 蜗牛都比你快！🐌
 */

/**
 * 根据反应时间计算性能评价
 * 
 * @param reactionTime - 反应时间（毫秒）
 * @returns 性能评价等级
 * 
 * @example
 * ```typescript
 * calculatePerformanceRating(120);  // 返回 '神级反应'
 * calculatePerformanceRating(180);  // 返回 '超快反应'
 * calculatePerformanceRating(220);  // 返回 '优秀反应'
 * calculatePerformanceRating(280);  // 返回 '良好反应'
 * calculatePerformanceRating(350);  // 返回 '还行吧'
 * calculatePerformanceRating(480);  // 返回 '有点慢'
 * calculatePerformanceRating(600);  // 返回 '反应迟钝'
 * ```
 */
export function calculatePerformanceRating(reactionTime: number): PerformanceRating {
  if (reactionTime < performanceThresholds.godlike) {
    return '神级反应';
  } else if (reactionTime < performanceThresholds.superfast) {
    return '超快反应';
  } else if (reactionTime < performanceThresholds.excellent) {
    return '优秀反应';
  } else if (reactionTime < performanceThresholds.good) {
    return '良好反应';
  } else if (reactionTime < performanceThresholds.average) {
    return '还行吧';
  } else if (reactionTime < performanceThresholds.slow) {
    return '有点慢';
  } else {
    return '反应迟钝';
  }
}
