/**
 * 表示一轮游戏的数据
 */
export interface GameRound {
  /** 颜色变化时间戳（毫秒） */
  colorChangeTimestamp: number | null;
  
  /** 玩家点击时间戳（毫秒） */
  clickTimestamp: number | null;
  
  /** 反应时间（毫秒） */
  reactionTime: number | null;
  
  /** 等待时间（毫秒） */
  waitingPeriod: number;
  
  /** 当前色块颜色 */
  currentColor: string;
}
