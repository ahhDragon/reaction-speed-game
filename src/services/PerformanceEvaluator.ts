import { PerformanceRating, performanceThresholds } from '../config/gameConfig';

/**
 * 性能评价器
 * 
 * 根据反应时间计算性能评价等级
 * 
 * 评价标准（7个等级 - 胖鹅主题）：
 * - 神速胖鹅：反应时间 < 180ms - 这只鹅开挂了！🦢⚡
 * - 闪电胖鹅：180ms ≤ 反应时间 < 250ms - 嘎嘎快！💨
 * - 敏捷胖鹅：250ms ≤ 反应时间 < 320ms - 身手不错～🦢✨
 * - 稳健胖鹅：320ms ≤ 反应时间 < 400ms - 稳稳的鹅～🦢
 * - 悠闲胖鹅：400ms ≤ 反应时间 < 500ms - 慢慢来嘛～🦢💤
 * - 迟钝胖鹅：500ms ≤ 反应时间 < 600ms - 鹅困了？😴
 * - 笨拙胖鹅：反应时间 ≥ 600ms - 这是一只慢鹅！🐌
 */

/**
 * 根据反应时间计算性能评价
 * 
 * @param reactionTime - 反应时间（毫秒）
 * @returns 性能评价等级
 * 
 * @example
 * ```typescript
 * calculatePerformanceRating(150);  // 返回 '神速胖鹅'
 * calculatePerformanceRating(220);  // 返回 '闪电胖鹅'
 * calculatePerformanceRating(280);  // 返回 '敏捷胖鹅'
 * calculatePerformanceRating(350);  // 返回 '稳健胖鹅'
 * calculatePerformanceRating(450);  // 返回 '悠闲胖鹅'
 * calculatePerformanceRating(550);  // 返回 '迟钝胖鹅'
 * calculatePerformanceRating(650);  // 返回 '笨拙胖鹅'
 * ```
 */
export function calculatePerformanceRating(reactionTime: number): PerformanceRating {
  if (reactionTime < performanceThresholds.godlike) {
    return '神速胖鹅';
  } else if (reactionTime < performanceThresholds.superfast) {
    return '闪电胖鹅';
  } else if (reactionTime < performanceThresholds.excellent) {
    return '敏捷胖鹅';
  } else if (reactionTime < performanceThresholds.good) {
    return '稳健胖鹅';
  } else if (reactionTime < performanceThresholds.average) {
    return '悠闲胖鹅';
  } else if (reactionTime < performanceThresholds.slow) {
    return '迟钝胖鹅';
  } else {
    return '笨拙胖鹅';
  }
}
