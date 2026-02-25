import { GameConfig } from '../types/GameConfig';

/**
 * 默认游戏配置
 * 
 * 配置说明：
 * - 色块尺寸：200x200 像素（满足需求 1.2 的最小尺寸要求）
 * - 初始颜色：红色 (#e74c3c) - 等待状态
 * - 变化后颜色：绿色 (#2ecc71) - 准备点击状态（视觉上有明显区别，满足需求 2.3）
 * - 等待时间范围：1000-5000ms（满足需求 2.1）
 * - 轮次间隔：1000ms（满足需求 8.3）
 * - 提前点击提示显示时间：1000ms（满足需求 7.3）
 * 
 * 性能评价阈值（满足需求 6.1-6.4）：
 * - 优秀：< 200ms
 * - 良好：200-300ms
 * - 一般：300-400ms
 * - 需要提高：> 400ms
 */
export const defaultGameConfig: GameConfig = {
  blockSize: {
    width: 200,
    height: 200,
  },
  
  colors: {
    initial: '#e74c3c',    // 红色 - 等待状态
    changed: '#2ecc71',    // 绿色 - 准备点击状态
  },
  
  waitingPeriodRange: {
    min: 1000,
    max: 5000,
  },
  
  roundInterval: 1000,
  
  earlyClickMessageDuration: 1000,
};

/**
 * 性能评价阈值配置
 * 
 * 根据反应时间（毫秒）判断性能等级（7个等级）：
 * - 神级反应：反应时间 < 150ms
 * - 超快反应：150ms ≤ 反应时间 < 200ms
 * - 优秀反应：200ms ≤ 反应时间 < 250ms
 * - 良好反应：250ms ≤ 反应时间 < 320ms
 * - 还行吧：320ms ≤ 反应时间 < 420ms
 * - 有点慢：420ms ≤ 反应时间 < 550ms
 * - 反应迟钝：反应时间 ≥ 550ms
 */
export const performanceThresholds = {
  godlike: 150,    // 神级阈值
  superfast: 200,  // 超快阈值
  excellent: 250,  // 优秀阈值
  good: 320,       // 良好阈值
  average: 420,    // 还行阈值
  slow: 550,       // 偏慢阈值
} as const;

/**
 * 性能评价类型
 */
export type PerformanceRating = '神级反应' | '超快反应' | '优秀反应' | '良好反应' | '还行吧' | '有点慢' | '反应迟钝';
