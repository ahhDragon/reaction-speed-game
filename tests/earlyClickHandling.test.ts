/**
 * 测试提前点击处理流程
 * 
 * 验证需求：
 * - 7.1: 显示"提前点击"提示信息
 * - 7.2: 重新开始当前游戏轮次
 * - 7.3: 提示显示至少 1000ms
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { GameController } from '../src/GameController';
import { GameState } from '../src/types/GameState';

// Mock DOM elements
function setupDOM() {
  document.body.innerHTML = `
    <div id="color-block"></div>
    <div id="result-display"></div>
    <div id="message-display"></div>
  `;
}

describe('提前点击处理流程 (Task 9.1)', () => {
  let gameController: GameController;

  beforeEach(() => {
    setupDOM();
    vi.useFakeTimers();
    gameController = new GameController();
    gameController.initialize();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('应该在提前点击时显示"提前点击"提示信息 (需求 7.1)', () => {
    // 开始游戏
    gameController.handleClick(); // INITIAL -> WAITING
    
    // 提前点击（在颜色变化前）
    gameController.handleClick(); // WAITING -> EARLY_CLICK
    
    // 验证提示信息显示
    const messageDisplay = document.getElementById('message-display');
    expect(messageDisplay?.textContent).toContain('提前点击');
  });

  it('应该在提前点击后重新开始游戏轮次 (需求 7.2)', () => {
    // 开始游戏
    gameController.handleClick(); // INITIAL -> WAITING
    
    // 获取初始色块颜色
    const colorBlock = document.getElementById('color-block');
    const initialColor = colorBlock?.style.backgroundColor;
    
    // 提前点击
    gameController.handleClick(); // WAITING -> EARLY_CLICK
    
    // 快进 1000ms（提前点击提示显示时间）
    vi.advanceTimersByTime(1000);
    
    // 验证游戏重新开始：色块应该重置为初始颜色
    expect(colorBlock?.style.backgroundColor).toBe(initialColor);
    
    // 验证消息被清空（新轮次开始）
    const messageDisplay = document.getElementById('message-display');
    expect(messageDisplay?.textContent).toBe('');
  });

  it('应该在提前点击提示显示至少 1000ms 后才重新开始 (需求 7.3)', () => {
    // 开始游戏
    gameController.handleClick(); // INITIAL -> WAITING
    
    // 提前点击
    gameController.handleClick(); // WAITING -> EARLY_CLICK
    
    // 验证提示信息显示
    const messageDisplay = document.getElementById('message-display');
    expect(messageDisplay?.textContent).toContain('提前点击');
    
    // 快进 999ms（不足 1000ms）
    vi.advanceTimersByTime(999);
    
    // 提示信息应该仍然显示
    expect(messageDisplay?.textContent).toContain('提前点击');
    
    // 再快进 1ms（总共 1000ms）
    vi.advanceTimersByTime(1);
    
    // 现在应该重新开始游戏，消息被清空
    expect(messageDisplay?.textContent).toBe('');
  });

  it('应该在提前点击时取消当前的等待定时器', () => {
    // 开始游戏
    gameController.handleClick(); // INITIAL -> WAITING
    
    // 提前点击
    gameController.handleClick(); // WAITING -> EARLY_CLICK
    
    // 快进到原本的颜色变化时间（假设是 3000ms）
    vi.advanceTimersByTime(3000);
    
    // 色块不应该变成绿色（因为定时器已被取消）
    const colorBlock = document.getElementById('color-block');
    expect(colorBlock?.style.backgroundColor).not.toContain('rgb(46, 204, 113)'); // 绿色
  });

  it('应该在提前点击后能够正常进行新的游戏轮次', () => {
    // 开始游戏
    gameController.handleClick(); // INITIAL -> WAITING
    
    // 提前点击
    gameController.handleClick(); // WAITING -> EARLY_CLICK
    
    // 快进 1000ms，重新开始游戏
    vi.advanceTimersByTime(1000);
    
    // 验证消息被清空
    const messageDisplay = document.getElementById('message-display');
    expect(messageDisplay?.textContent).toBe('');
    
    // 快进到颜色变化时间（最多 5000ms）
    vi.advanceTimersByTime(5000);
    
    // 色块应该变成绿色
    const colorBlock = document.getElementById('color-block');
    const bgColor = colorBlock?.style.backgroundColor;
    // 绿色 #2ecc71 转换为 rgb(46, 204, 113)
    expect(bgColor).toContain('46');
    expect(bgColor).toContain('204');
    expect(bgColor).toContain('113');
  });

  it('应该在多次提前点击时每次都显示提示并重新开始', () => {
    // 第一次游戏
    gameController.handleClick(); // INITIAL -> WAITING
    gameController.handleClick(); // WAITING -> EARLY_CLICK
    
    const messageDisplay = document.getElementById('message-display');
    expect(messageDisplay?.textContent).toContain('提前点击');
    
    // 快进 1000ms，重新开始
    vi.advanceTimersByTime(1000);
    expect(messageDisplay?.textContent).toBe('');
    
    // 第二次提前点击
    gameController.handleClick(); // WAITING -> EARLY_CLICK
    expect(messageDisplay?.textContent).toContain('提前点击');
    
    // 快进 1000ms，重新开始
    vi.advanceTimersByTime(1000);
    expect(messageDisplay?.textContent).toBe('');
  });
});
