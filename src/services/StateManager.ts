import { GameState } from '../types/GameState';
import { StateManager as IStateManager } from '../interfaces/StateManager';

/**
 * 状态管理器实现
 * 管理游戏状态转换和状态变化通知
 */
export class StateManager implements IStateManager {
  private currentState: GameState;
  private listeners: Array<(state: GameState) => void>;
  
  // 定义合法的状态转换映射
  private readonly validTransitions: Map<GameState, Set<GameState>>;

  constructor() {
    this.currentState = GameState.INITIAL;
    this.listeners = [];
    
    // 初始化合法的状态转换规则
    this.validTransitions = new Map<GameState, Set<GameState>>([
      [GameState.INITIAL, new Set([GameState.WAITING])],
      [GameState.WAITING, new Set([GameState.EARLY_CLICK, GameState.READY])],
      [GameState.EARLY_CLICK, new Set([GameState.WAITING])],
      [GameState.READY, new Set([GameState.RESULT])],
      [GameState.RESULT, new Set([GameState.WAITING])]
    ]);
  }

  /**
   * 获取当前状态
   * @returns 当前游戏状态
   */
  getCurrentState(): GameState {
    return this.currentState;
  }

  /**
   * 设置状态
   * 验证状态转换的合法性，如果非法则抛出错误
   * @param state 新的游戏状态
   * @throws Error 如果状态转换非法
   */
  setState(state: GameState): void {
    // 验证状态转换是否合法
    if (!this.isValidTransition(this.currentState, state)) {
      throw new Error(
        `Invalid state transition: ${this.currentState} -> ${state}`
      );
    }

    // 更新状态
    this.currentState = state;

    // 通知所有监听器
    this.notifyListeners(state);
  }

  /**
   * 订阅状态变化
   * @param callback 状态变化时的回调函数
   */
  onStateChange(callback: (state: GameState) => void): void {
    this.listeners.push(callback);
  }

  /**
   * 验证状态转换是否合法
   * @param from 当前状态
   * @param to 目标状态
   * @returns 是否为合法转换
   */
  private isValidTransition(from: GameState, to: GameState): boolean {
    const allowedStates = this.validTransitions.get(from);
    return allowedStates ? allowedStates.has(to) : false;
  }

  /**
   * 通知所有监听器状态已变化
   * @param state 新的状态
   */
  private notifyListeners(state: GameState): void {
    this.listeners.forEach(listener => {
      try {
        listener(state);
      } catch (error) {
        // 捕获监听器中的错误，防止影响其他监听器
        console.error('Error in state change listener:', error);
      }
    });
  }
}
