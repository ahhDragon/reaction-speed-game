/**
 * 提供高精度时间测量功能
 */
export interface TimerService {
  /**
   * 获取当前时间戳（毫秒）
   * @returns 当前时间戳
   */
  getCurrentTimestamp(): number;
  
  /**
   * 设置延迟执行
   * @param callback 延迟执行的回调函数
   * @param delay 延迟时间（毫秒）
   */
  setDelay(callback: () => void, delay: number): void;
  
  /**
   * 取消延迟
   */
  cancelDelay(): void;
}
