/**
 * 性能评价类型
 */
export type RatingLevel = '优秀' | '良好' | '一般' | '需要提高';

/**
 * 性能评价的数据结构
 */
export interface PerformanceRating {
  /** 评价等级 */
  rating: RatingLevel;
  
  /** 反应时间阈值 */
  threshold: {
    excellent: 200;
    good: 300;
    average: 400;
  };
}
