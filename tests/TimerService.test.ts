import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TimerService } from '../src/services/TimerService';
import * as fc from 'fast-check';

describe('TimerService', () => {
  let timerService: TimerService;

  beforeEach(() => {
    timerService = new TimerService();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('getCurrentTimestamp', () => {
    it('应该返回一个有效的时间戳（非空且为正数）', () => {
      const timestamp = timerService.getCurrentTimestamp();
      expect(timestamp).toBeDefined();
      expect(typeof timestamp).toBe('number');
      expect(timestamp).toBeGreaterThan(0);
    });

    it('应该返回递增的时间戳', () => {
      vi.useRealTimers(); // 使用真实时间来测试递增
      const timestamp1 = timerService.getCurrentTimestamp();
      
      // 等待一小段时间
      const start = Date.now();
      while (Date.now() - start < 10) {
        // 忙等待
      }
      
      const timestamp2 = timerService.getCurrentTimestamp();
      expect(timestamp2).toBeGreaterThanOrEqual(timestamp1);
    });

    it('应该返回毫秒级精度的时间戳', () => {
      const timestamp = timerService.getCurrentTimestamp();
      // 验证时间戳是一个合理的毫秒值
      expect(timestamp).toBeGreaterThan(0);
      expect(Number.isFinite(timestamp)).toBe(true);
    });
  });

  describe('setDelay', () => {
    it('应该在指定延迟后执行回调', () => {
      const callback = vi.fn();
      const delay = 1000;

      timerService.setDelay(callback, delay);
      
      expect(callback).not.toHaveBeenCalled();
      
      vi.advanceTimersByTime(delay);
      
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('应该取消之前的定时器', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      timerService.setDelay(callback1, 1000);
      timerService.setDelay(callback2, 1000);
      
      vi.advanceTimersByTime(1000);
      
      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('应该准确执行不同延迟时间的回调', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const callback3 = vi.fn();

      // 测试短延迟
      timerService.setDelay(callback1, 100);
      vi.advanceTimersByTime(100);
      expect(callback1).toHaveBeenCalledTimes(1);

      // 测试中等延迟
      timerService.setDelay(callback2, 1000);
      vi.advanceTimersByTime(1000);
      expect(callback2).toHaveBeenCalledTimes(1);

      // 测试长延迟
      timerService.setDelay(callback3, 5000);
      vi.advanceTimersByTime(5000);
      expect(callback3).toHaveBeenCalledTimes(1);
    });

    it('应该在延迟时间未到时不执行回调', () => {
      const callback = vi.fn();
      
      timerService.setDelay(callback, 1000);
      vi.advanceTimersByTime(999);
      
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('cancelDelay', () => {
    it('应该取消已设置的定时器', () => {
      const callback = vi.fn();

      timerService.setDelay(callback, 1000);
      timerService.cancelDelay();
      
      vi.advanceTimersByTime(1000);
      
      expect(callback).not.toHaveBeenCalled();
    });

    it('应该能够安全地多次调用', () => {
      expect(() => {
        timerService.cancelDelay();
        timerService.cancelDelay();
      }).not.toThrow();
    });

    it('应该在延迟执行前取消定时器', () => {
      const callback = vi.fn();

      timerService.setDelay(callback, 1000);
      vi.advanceTimersByTime(500); // 只过去一半时间
      timerService.cancelDelay();
      vi.advanceTimersByTime(500); // 完成剩余时间
      
      expect(callback).not.toHaveBeenCalled();
    });

    it('应该在没有设置定时器时安全调用', () => {
      expect(() => {
        timerService.cancelDelay();
      }).not.toThrow();
    });
  });

  describe('Property-Based Tests', () => {
    describe('属性 4: 颜色变化时间戳被记录', () => {
      it('**Validates: Requirements 2.4** - 对于任何颜色变化事件，系统应该记录一个有效的时间戳（非空且为正数）', () => {
        vi.useRealTimers(); // 使用真实时间进行属性测试
        
        fc.assert(
          fc.property(fc.integer({ min: 1, max: 100 }), (iterations) => {
            // 模拟多次颜色变化事件，每次都应该记录有效的时间戳
            const timestamps: number[] = [];
            
            for (let i = 0; i < iterations; i++) {
              const timestamp = timerService.getCurrentTimestamp();
              timestamps.push(timestamp);
            }
            
            // 验证所有时间戳都是有效的（非空且为正数）
            return timestamps.every(ts => {
              return ts !== null && 
                     ts !== undefined && 
                     typeof ts === 'number' && 
                     ts > 0 && 
                     Number.isFinite(ts);
            });
          }),
          { numRuns: 100 }
        );
      });

      it('**Validates: Requirements 2.4** - 时间戳应该是单调递增的（或相等）', () => {
        vi.useRealTimers(); // 使用真实时间进行属性测试
        
        fc.assert(
          fc.property(fc.integer({ min: 2, max: 50 }), (iterations) => {
            // 记录多个时间戳
            const timestamps: number[] = [];
            
            for (let i = 0; i < iterations; i++) {
              timestamps.push(timerService.getCurrentTimestamp());
              // 添加微小延迟以确保时间推进
              const start = Date.now();
              while (Date.now() - start < 1) {
                // 忙等待
              }
            }
            
            // 验证时间戳是单调递增的（或相等）
            for (let i = 1; i < timestamps.length; i++) {
              if (timestamps[i] < timestamps[i - 1]) {
                return false;
              }
            }
            return true;
          }),
          { numRuns: 100 }
        );
      });
    });

    describe('属性 5: 点击时间戳被记录', () => {
      it('**Validates: Requirements 3.1** - 对于任何点击事件，系统应该记录一个有效的时间戳（非空且为正数）', () => {
        vi.useRealTimers(); // 使用真实时间进行属性测试
        
        fc.assert(
          fc.property(fc.integer({ min: 1, max: 100 }), (clickCount) => {
            // 模拟多次点击事件，每次都应该记录有效的时间戳
            const clickTimestamps: number[] = [];
            
            for (let i = 0; i < clickCount; i++) {
              const timestamp = timerService.getCurrentTimestamp();
              clickTimestamps.push(timestamp);
            }
            
            // 验证所有点击时间戳都是有效的（非空且为正数）
            return clickTimestamps.every(ts => {
              return ts !== null && 
                     ts !== undefined && 
                     typeof ts === 'number' && 
                     ts > 0 && 
                     Number.isFinite(ts);
            });
          }),
          { numRuns: 100 }
        );
      });

      it('**Validates: Requirements 3.1** - 点击时间戳应该能够用于计算反应时间', () => {
        vi.useRealTimers(); // 使用真实时间进行属性测试
        
        fc.assert(
          fc.property(fc.integer({ min: 1, max: 50 }), (iterations) => {
            // 模拟颜色变化和点击的时间戳对
            const pairs: Array<{ colorChange: number; click: number }> = [];
            
            for (let i = 0; i < iterations; i++) {
              const colorChangeTimestamp = timerService.getCurrentTimestamp();
              
              // 模拟一个小延迟（代表用户反应时间）
              const start = Date.now();
              while (Date.now() - start < 5) {
                // 忙等待
              }
              
              const clickTimestamp = timerService.getCurrentTimestamp();
              pairs.push({ colorChange: colorChangeTimestamp, click: clickTimestamp });
            }
            
            // 验证所有时间戳对都能计算出有效的反应时间
            return pairs.every(pair => {
              const reactionTime = pair.click - pair.colorChange;
              return reactionTime >= 0 && Number.isFinite(reactionTime);
            });
          }),
          { numRuns: 100 }
        );
      });
    });
  });
});
