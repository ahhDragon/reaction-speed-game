import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { GameController } from '../src/GameController';
import { GameState } from '../src/types/GameState';
import { defaultGameConfig } from '../src/config/gameConfig';

/**
 * GameController.handleClick() 单元测试
 * 
 * 测试点击处理逻辑
 */
describe('GameController.handleClick()', () => {
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
    gameController.initialize();
    
    // 使用假定时器
    vi.useFakeTimers();
  });

  afterEach(() => {
    // 恢复真实定时器
    vi.restoreAllMocks();
  });

  describe('INITIAL 状态下的点击', () => {
    it('应该开始第一轮游戏', () => {
      // 需求 9.3: 在玩家首次点击色块后开始第一个游戏轮次
      
      // 点击色块
      colorBlockElement.click();

      // 应该清空消息显示（游戏说明被清除）
      expect(messageDisplayElement.textContent).toBe('');

      // 色块应该是红色（等待状态）
      expect(colorBlockElement.style.backgroundColor).toBe(
        defaultGameConfig.colors.initial
      );
    });
  });

  describe('WAITING 状态下的点击（提前点击）', () => {
    beforeEach(() => {
      // 开始一轮游戏，进入 WAITING 状态
      colorBlockElement.click();
    });

    it('应该显示提前点击提示信息', () => {
      // 需求 7.1: 显示"提前点击"提示信息
      
      // 在等待期内点击（提前点击）
      colorBlockElement.click();

      // 应该显示提前点击提示
      expect(messageDisplayElement.textContent).toContain('提前点击');
    });

    it('应该在至少 1000ms 后重新开始游戏', () => {
      // 需求 7.3: 提示显示至少 1000ms
      
      // 提前点击
      colorBlockElement.click();

      // 快进 999ms
      vi.advanceTimersByTime(999);

      // 消息应该仍然显示
      expect(messageDisplayElement.textContent).toContain('提前点击');

      // 快进到 1000ms
      vi.advanceTimersByTime(1);

      // 消息应该被清空（游戏重新开始）
      expect(messageDisplayElement.textContent).toBe('');
    });

    it('应该重新开始当前游戏轮次', () => {
      // 需求 7.2: 重新开始当前游戏轮次
      
      // 提前点击
      colorBlockElement.click();

      // 快进到提示显示结束
      vi.advanceTimersByTime(1000);

      // 色块应该重置为红色
      expect(colorBlockElement.style.backgroundColor).toBe(
        defaultGameConfig.colors.initial
      );
    });
  });

  describe('READY 状态下的点击（有效点击）', () => {
    beforeEach(() => {
      // 开始一轮游戏
      colorBlockElement.click();
      
      // 快进到颜色变化（进入 READY 状态）
      vi.advanceTimersByTime(5000);
    });

    it('应该计算并显示反应时间', () => {
      // 需求 3.3, 4.1: 计算反应时间
      
      // 点击色块
      colorBlockElement.click();

      // 应该显示反应时间
      expect(resultDisplayElement.textContent).toContain('反应时间');
      expect(resultDisplayElement.textContent).toContain('毫秒');
    });

    it('应该显示性能评价', () => {
      // 需求 6.5: 同时显示反应时间和性能评价
      
      // 点击色块
      colorBlockElement.click();

      // 应该显示性能评价（优秀、良好、一般或需要提高）
      const resultText = resultDisplayElement.textContent || '';
      const hasRating = 
        resultText.includes('优秀') ||
        resultText.includes('良好') ||
        resultText.includes('一般') ||
        resultText.includes('需要提高');
      
      expect(hasRating).toBe(true);
    });

    it('应该在延迟后自动开始新一轮游戏', () => {
      // 需求 8.1, 8.3: 自动开始新轮次，间隔至少 1000ms
      
      // 点击色块
      colorBlockElement.click();

      // 结果应该显示
      expect(resultDisplayElement.textContent).toContain('反应时间');

      // 快进到轮次间隔结束
      vi.advanceTimersByTime(1000);

      // 结果应该被清空（新轮次开始）
      expect(resultDisplayElement.textContent).toBe('');
      
      // 色块应该重置为红色
      expect(colorBlockElement.style.backgroundColor).toBe(
        defaultGameConfig.colors.initial
      );
    });
  });

  describe('RESULT 状态下的点击', () => {
    beforeEach(() => {
      // 完成一轮游戏，进入 RESULT 状态
      colorBlockElement.click(); // 开始游戏
      vi.advanceTimersByTime(5000); // 等待颜色变化
      colorBlockElement.click(); // 点击色块
    });

    it('应该忽略点击', () => {
      // 在 RESULT 状态下点击
      const resultTextBefore = resultDisplayElement.textContent;
      
      colorBlockElement.click();

      // 结果显示不应该改变
      expect(resultDisplayElement.textContent).toBe(resultTextBefore);
    });
  });

  describe('EARLY_CLICK 状态下的点击', () => {
    beforeEach(() => {
      // 触发提前点击，进入 EARLY_CLICK 状态
      colorBlockElement.click(); // 开始游戏
      colorBlockElement.click(); // 提前点击
    });

    it('应该忽略点击', () => {
      // 在 EARLY_CLICK 状态下点击
      const messageTextBefore = messageDisplayElement.textContent;
      
      colorBlockElement.click();

      // 消息显示不应该改变
      expect(messageDisplayElement.textContent).toBe(messageTextBefore);
    });
  });
});
