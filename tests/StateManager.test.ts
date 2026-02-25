import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StateManager } from '../src/services/StateManager';
import { GameState } from '../src/types/GameState';

describe('StateManager', () => {
  let stateManager: StateManager;

  beforeEach(() => {
    stateManager = new StateManager();
  });

  describe('getCurrentState', () => {
    it('应该返回初始状态为 INITIAL', () => {
      expect(stateManager.getCurrentState()).toBe(GameState.INITIAL);
    });

    it('应该返回最新设置的状态', () => {
      stateManager.setState(GameState.WAITING);
      expect(stateManager.getCurrentState()).toBe(GameState.WAITING);
    });
  });

  describe('setState', () => {
    it('应该成功设置合法的状态转换', () => {
      // INITIAL -> WAITING
      expect(() => {
        stateManager.setState(GameState.WAITING);
      }).not.toThrow();
      expect(stateManager.getCurrentState()).toBe(GameState.WAITING);
    });

    it('应该拒绝非法的状态转换', () => {
      // INITIAL -> READY 是非法的
      expect(() => {
        stateManager.setState(GameState.READY);
      }).toThrow('Invalid state transition: INITIAL -> READY');
    });

    it('应该支持完整的游戏流程状态转换', () => {
      // INITIAL -> WAITING
      stateManager.setState(GameState.WAITING);
      expect(stateManager.getCurrentState()).toBe(GameState.WAITING);

      // WAITING -> READY
      stateManager.setState(GameState.READY);
      expect(stateManager.getCurrentState()).toBe(GameState.READY);

      // READY -> RESULT
      stateManager.setState(GameState.RESULT);
      expect(stateManager.getCurrentState()).toBe(GameState.RESULT);

      // RESULT -> WAITING (新一轮)
      stateManager.setState(GameState.WAITING);
      expect(stateManager.getCurrentState()).toBe(GameState.WAITING);
    });

    it('应该支持提前点击的状态转换', () => {
      // INITIAL -> WAITING
      stateManager.setState(GameState.WAITING);
      
      // WAITING -> EARLY_CLICK
      stateManager.setState(GameState.EARLY_CLICK);
      expect(stateManager.getCurrentState()).toBe(GameState.EARLY_CLICK);

      // EARLY_CLICK -> WAITING (重新开始)
      stateManager.setState(GameState.WAITING);
      expect(stateManager.getCurrentState()).toBe(GameState.WAITING);
    });

    it('应该拒绝从 RESULT 直接到 READY 的转换', () => {
      stateManager.setState(GameState.WAITING);
      stateManager.setState(GameState.READY);
      stateManager.setState(GameState.RESULT);

      expect(() => {
        stateManager.setState(GameState.READY);
      }).toThrow('Invalid state transition: RESULT -> READY');
    });

    it('应该拒绝从 EARLY_CLICK 到 READY 的转换', () => {
      stateManager.setState(GameState.WAITING);
      stateManager.setState(GameState.EARLY_CLICK);

      expect(() => {
        stateManager.setState(GameState.READY);
      }).toThrow('Invalid state transition: EARLY_CLICK -> READY');
    });
  });

  describe('onStateChange', () => {
    it('应该在状态变化时通知监听器', () => {
      const listener = vi.fn();
      stateManager.onStateChange(listener);

      stateManager.setState(GameState.WAITING);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(GameState.WAITING);
    });

    it('应该通知所有注册的监听器', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      const listener3 = vi.fn();

      stateManager.onStateChange(listener1);
      stateManager.onStateChange(listener2);
      stateManager.onStateChange(listener3);

      stateManager.setState(GameState.WAITING);

      expect(listener1).toHaveBeenCalledWith(GameState.WAITING);
      expect(listener2).toHaveBeenCalledWith(GameState.WAITING);
      expect(listener3).toHaveBeenCalledWith(GameState.WAITING);
    });

    it('应该在每次状态变化时通知监听器', () => {
      const listener = vi.fn();
      stateManager.onStateChange(listener);

      stateManager.setState(GameState.WAITING);
      stateManager.setState(GameState.READY);
      stateManager.setState(GameState.RESULT);

      expect(listener).toHaveBeenCalledTimes(3);
      expect(listener).toHaveBeenNthCalledWith(1, GameState.WAITING);
      expect(listener).toHaveBeenNthCalledWith(2, GameState.READY);
      expect(listener).toHaveBeenNthCalledWith(3, GameState.RESULT);
    });

    it('应该在监听器抛出错误时继续通知其他监听器', () => {
      const listener1 = vi.fn(() => {
        throw new Error('Listener 1 error');
      });
      const listener2 = vi.fn();
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      stateManager.onStateChange(listener1);
      stateManager.onStateChange(listener2);

      stateManager.setState(GameState.WAITING);

      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('应该不在非法状态转换时通知监听器', () => {
      const listener = vi.fn();
      stateManager.onStateChange(listener);

      expect(() => {
        stateManager.setState(GameState.READY);
      }).toThrow();

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('状态转换验证', () => {
    it('应该验证所有合法的状态转换', () => {
      const validTransitions = [
        [GameState.INITIAL, GameState.WAITING],
        [GameState.WAITING, GameState.EARLY_CLICK],
        [GameState.WAITING, GameState.READY],
        [GameState.EARLY_CLICK, GameState.WAITING],
        [GameState.READY, GameState.RESULT],
        [GameState.RESULT, GameState.WAITING]
      ];

      validTransitions.forEach(([from, to]) => {
        const manager = new StateManager();
        
        // 设置到起始状态
        if (from !== GameState.INITIAL) {
          // 需要通过合法路径到达起始状态
          if (from === GameState.WAITING) {
            manager.setState(GameState.WAITING);
          } else if (from === GameState.EARLY_CLICK) {
            manager.setState(GameState.WAITING);
            manager.setState(GameState.EARLY_CLICK);
          } else if (from === GameState.READY) {
            manager.setState(GameState.WAITING);
            manager.setState(GameState.READY);
          } else if (from === GameState.RESULT) {
            manager.setState(GameState.WAITING);
            manager.setState(GameState.READY);
            manager.setState(GameState.RESULT);
          }
        }

        // 验证转换是合法的
        expect(() => {
          manager.setState(to);
        }).not.toThrow();
      });
    });

    it('应该拒绝所有非法的状态转换', () => {
      const invalidTransitions = [
        [GameState.INITIAL, GameState.READY],
        [GameState.INITIAL, GameState.RESULT],
        [GameState.INITIAL, GameState.EARLY_CLICK],
        [GameState.WAITING, GameState.RESULT],
        [GameState.EARLY_CLICK, GameState.READY],
        [GameState.EARLY_CLICK, GameState.RESULT],
        [GameState.READY, GameState.WAITING],
        [GameState.READY, GameState.EARLY_CLICK],
        [GameState.RESULT, GameState.READY],
        [GameState.RESULT, GameState.EARLY_CLICK]
      ];

      invalidTransitions.forEach(([from, to]) => {
        const manager = new StateManager();
        
        // 设置到起始状态
        if (from !== GameState.INITIAL) {
          if (from === GameState.WAITING) {
            manager.setState(GameState.WAITING);
          } else if (from === GameState.EARLY_CLICK) {
            manager.setState(GameState.WAITING);
            manager.setState(GameState.EARLY_CLICK);
          } else if (from === GameState.READY) {
            manager.setState(GameState.WAITING);
            manager.setState(GameState.READY);
          } else if (from === GameState.RESULT) {
            manager.setState(GameState.WAITING);
            manager.setState(GameState.READY);
            manager.setState(GameState.RESULT);
          }
        }

        // 验证转换是非法的
        expect(() => {
          manager.setState(to);
        }).toThrow(/Invalid state transition/);
      });
    });
  });
});
