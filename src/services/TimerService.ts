import { TimerService as ITimerService } from '../interfaces/TimerService';

/**
 * TimerService 实现类
 * 提供高精度时间测量和延迟执行功能
 */
export class TimerService implements ITimerService {
  private timerId: number | null = null;

  /**
   * 获取当前时间戳（毫秒）
   * 优先使用 performance.now() 以获得更高精度
   * 如果不可用则回退到 Date.now()
   * @returns 当前时间戳（毫秒）
   */
  getCurrentTimestamp(): number {
    if (typeof performance !== 'undefined' && performance.now) {
      return performance.now();
    }
    return Date.now();
  }

  /**
   * 设置延迟执行
   * @param callback 延迟执行的回调函数
   * @param delay 延迟时间（毫秒）
   */
  setDelay(callback: () => void, delay: number): void {
    this.cancelDelay(); // 清除之前的定时器
    this.timerId = setTimeout(callback, delay) as unknown as number;
  }

  /**
   * 取消延迟
   */
  cancelDelay(): void {
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}
