/**
 * 游戏状态枚举
 */
export enum GameState {
  /** 初始状态，显示说明 */
  INITIAL = 'INITIAL',
  
  /** 等待颜色变化 */
  WAITING = 'WAITING',
  
  /** 颜色已变化，等待点击 */
  READY = 'READY',
  
  /** 显示结果 */
  RESULT = 'RESULT',
  
  /** 提前点击 */
  EARLY_CLICK = 'EARLY_CLICK'
}
