/**
 * 游戏配置参数
 */
export interface GameConfig {
  /** 色块尺寸（像素） */
  blockSize: {
    width: number;
    height: number;
  };
  
  /** 颜色配置 */
  colors: {
    /** 初始颜色 */
    initial: string;
    /** 变化后颜色 */
    changed: string;
  };
  
  /** 等待时间范围（毫秒） */
  waitingPeriodRange: {
    min: number;
    max: number;
  };
  
  /** 轮次间隔（毫秒） */
  roundInterval: number;
  
  /** 提前点击提示显示时间（毫秒） */
  earlyClickMessageDuration: number;
}
