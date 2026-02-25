import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { GameController } from '../src/GameController';
import { GameState } from '../src/types/GameState';
import { defaultGameConfig } from '../src/config/gameConfig';

/**
 * GameController 单元测试
 * 
 * 测试游戏控制器的初始化功能
 */
describe('GameController', () => {
  let gameController: GameController;
  let colorBlockElement: HTMLElement;
  let resultDisplayElement: HTMLElement;
  let messageDisplayElement: HTMLElement;

  beforeEach(() => {
    // 设置 DOM 环境
    document.body.innerHTML = `
      <div id="game-container">
        <div id="color-block"></div>
        <div id="result-display"></div>
        <div id="message-display"></div>
      </div>
    `;

    colorBlockElement = document.getElementById('color-block')!;
    resultDisplayElement = document.getElementById('result-display')!;
    messageDisplayElement = document.getElementById('message-display')!;

    gameController = new GameController();
    
    // 使用假定时器
    vi.useFakeTimers();
  });

  afterEach(() => {
    // 恢复真实定时器
    vi.restoreAllMocks();
  });

  describe('initialize()', () => {
    it('应该显示初始状态的色块（红色）', () => {
      // 需求 9.1: 网页加载完成时显示初始状态的色块
      gameController.initialize();

      expect(colorBlockElement.style.backgroundColor).toBe(
        defaultGameConfig.colors.initial
      );
    });

    it('应该显示游戏说明', () => {
      // 需求 9.2: 网页加载完成时显示游戏说明
      gameController.initialize();

      expect(messageDisplayElement.textContent).toContain('点击色块开始游戏');
      expect(messageDisplayElement.textContent).toContain('等待色块变绿后尽快点击');
    });

    it('应该设置色块的点击事件监听器', () => {
      // 需求 9.3: 在玩家首次点击色块后开始第一个游戏轮次
      gameController.initialize();

      // 验证点击事件监听器已设置
      // 通过检查点击不会抛出错误来验证
      expect(() => {
        colorBlockElement.click();
      }).not.toThrow();
    });

    it('应该初始化 StateManager、TimerService 和 UIRenderer', () => {
      // 验证初始化不会抛出错误
      expect(() => {
        gameController.initialize();
      }).not.toThrow();
    });

    it('应该设置色块的尺寸为至少 200x200 像素', () => {
      // 需求 1.2: 色块占据至少 200x200 像素的区域
      gameController.initialize();

      const width = parseInt(colorBlockElement.style.width);
      const height = parseInt(colorBlockElement.style.height);

      expect(width).toBeGreaterThanOrEqual(200);
      expect(height).toBeGreaterThanOrEqual(200);
    });
  });

  describe('startRound()', () => {
    beforeEach(() => {
      gameController.initialize();
    });

    it('应该重置色块到初始颜色（红色）', () => {
      // 需求 8.2: 重置色块到初始颜色
      gameController.startRound();

      expect(colorBlockElement.style.backgroundColor).toBe(
        defaultGameConfig.colors.initial
      );
    });

    it('应该清空之前的结果和消息显示', () => {
      // 设置一些内容
      resultDisplayElement.textContent = '反应时间: 250 毫秒';
      messageDisplayElement.textContent = '提前点击';

      gameController.startRound();

      expect(resultDisplayElement.textContent).toBe('');
      expect(messageDisplayElement.textContent).toBe('');
    });

    it('应该在等待期结束后改变色块颜色为绿色', () => {
      // 需求 2.2: 等待期结束后改变色块颜色
      gameController.startRound();

      // 初始应该是红色
      expect(colorBlockElement.style.backgroundColor).toBe(
        defaultGameConfig.colors.initial
      );

      // 快进到等待期结束（最大 5000ms）
      vi.advanceTimersByTime(5000);

      // 应该变为绿色
      expect(colorBlockElement.style.backgroundColor).toBe(
        defaultGameConfig.colors.changed
      );
    });

    it('应该在等待期内不改变色块颜色', () => {
      // 需求 2.1: 等待时间在 1000-5000ms 之间
      gameController.startRound();

      // 初始应该是红色
      expect(colorBlockElement.style.backgroundColor).toBe(
        defaultGameConfig.colors.initial
      );

      // 快进 500ms（小于最小等待时间）
      vi.advanceTimersByTime(500);

      // 应该仍然是红色
      expect(colorBlockElement.style.backgroundColor).toBe(
        defaultGameConfig.colors.initial
      );
    });

    it('应该生成 1000-5000ms 之间的随机等待时间', () => {
      // 需求 2.1: 设置 1000-5000ms 之间的随机等待时间
      // 测试多次以验证随机性
      const waitingTimes: number[] = [];
      
      for (let i = 0; i < 10; i++) {
        gameController.startRound();
        
        // 测试在 1000ms 时色块应该还是红色
        vi.advanceTimersByTime(999);
        expect(colorBlockElement.style.backgroundColor).toBe(
          defaultGameConfig.colors.initial
        );
        
        // 继续快进到 5000ms，色块应该变绿
        vi.advanceTimersByTime(4001);
        expect(colorBlockElement.style.backgroundColor).toBe(
          defaultGameConfig.colors.changed
        );
        
        // 清理定时器
        vi.clearAllTimers();
      }
    });
  });
});
