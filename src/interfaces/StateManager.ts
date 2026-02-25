import { GameState } from '../types/GameState';

/**
 * 管理游戏状态和状态转换
 */
export interface StateManager {
  /**
   * 获取当前状态
   * @returns 当前游戏状态
   */
  getCurrentState(): GameState;
  
  /**
   * 设置状态
   * @param state 新的游戏状态
   */
  setState(state: GameState): void;
  
  /**
   * 订阅状态变化
   * @param callback 状态变化时的回调函数
   */
  onStateChange(callback: (state: GameState) => void): void;
}
