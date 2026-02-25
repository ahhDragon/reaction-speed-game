/**
 * 游戏控制器是核心组件，负责协调整个游戏流程
 */
export interface GameController {
  /**
   * 初始化游戏
   */
  initialize(): void;
  
  /**
   * 开始新一轮游戏
   */
  startRound(): void;
  
  /**
   * 处理玩家点击
   */
  handleClick(): void;
  
  /**
   * 重置游戏状态
   */
  reset(): void;
}
