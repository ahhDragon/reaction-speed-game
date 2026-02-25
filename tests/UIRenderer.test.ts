import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { UIRenderer } from '../src/services/UIRenderer';
import { defaultGameConfig } from '../src/config/gameConfig';

// Mock DOM elements
class MockHTMLElement {
  public id: string;
  public style: Record<string, string>;
  public textContent: string | null;
  public innerHTML: string;
  public className: string;
  public classList: {
    add: (className: string) => void;
    remove: (className: string) => void;
  };

  constructor(id: string) {
    this.id = id;
    this.style = {};
    this.textContent = null;
    this.innerHTML = '';
    this.className = '';
    this.classList = {
      add: (className: string) => {
        this.className = className;
      },
      remove: (className: string) => {
        if (this.className === className) {
          this.className = '';
        }
      }
    };
  }
}

describe('UIRenderer', () => {
  let uiRenderer: UIRenderer;
  let colorBlockElement: MockHTMLElement;
  let resultDisplayElement: MockHTMLElement;
  let messageDisplayElement: MockHTMLElement;
  let getElementByIdSpy: any;

  beforeEach(() => {
    // 创建 mock DOM 元素
    colorBlockElement = new MockHTMLElement('color-block');
    resultDisplayElement = new MockHTMLElement('result-display');
    messageDisplayElement = new MockHTMLElement('message-display');

    // Mock document.getElementById
    getElementByIdSpy = vi.fn((id: string) => {
      if (id === 'color-block') return colorBlockElement as any;
      if (id === 'result-display') return resultDisplayElement as any;
      if (id === 'message-display') return messageDisplayElement as any;
      return null;
    });

    // Mock global document object
    global.document = {
      getElementById: getElementByIdSpy
    } as any;

    uiRenderer = new UIRenderer();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('初始化', () => {
    it('应该正确初始化色块尺寸（需求 1.2）', () => {
      const { width, height } = defaultGameConfig.blockSize;
      
      expect(colorBlockElement.style.width).toBe(`${width}px`);
      expect(colorBlockElement.style.height).toBe(`${height}px`);
    });

    it('应该在 DOM 元素缺失时抛出错误', () => {
      // Mock document.getElementById to return null
      global.document = {
        getElementById: vi.fn(() => null)
      } as any;
      
      expect(() => new UIRenderer()).toThrow('Required DOM elements not found');
    });

    it('色块尺寸应该至少为 200x200 像素（需求 1.2）', () => {
      const width = parseInt(colorBlockElement.style.width);
      const height = parseInt(colorBlockElement.style.height);
      
      expect(width).toBeGreaterThanOrEqual(200);
      expect(height).toBeGreaterThanOrEqual(200);
    });
  });

  describe('renderColorBlock', () => {
    it('应该设置色块的背景颜色（需求 1.1）', () => {
      const testColor = '#ff0000';
      
      uiRenderer.renderColorBlock(testColor);
      
      expect(colorBlockElement.style.backgroundColor).toBe(testColor);
    });

    it('应该能够渲染初始颜色', () => {
      const initialColor = defaultGameConfig.colors.initial;
      
      uiRenderer.renderColorBlock(initialColor);
      
      expect(colorBlockElement.style.backgroundColor).toBeTruthy();
    });

    it('应该能够渲染变化后的颜色', () => {
      const changedColor = defaultGameConfig.colors.changed;
      
      uiRenderer.renderColorBlock(changedColor);
      
      expect(colorBlockElement.style.backgroundColor).toBeTruthy();
    });
  });

  describe('displayResult', () => {
    it('应该显示反应时间和评价（需求 4.2, 5.1, 6.5）', () => {
      const reactionTime = 250;
      const rating = '良好';
      
      uiRenderer.displayResult(reactionTime, rating);
      
      expect(resultDisplayElement.innerHTML).toContain('250');
      expect(resultDisplayElement.innerHTML).toContain('良好');
    });

    it('应该包含毫秒单位（需求 5.2）', () => {
      const reactionTime = 180;
      const rating = '优秀';
      
      uiRenderer.displayResult(reactionTime, rating);
      
      expect(resultDisplayElement.innerHTML).toMatch(/毫秒|ms/);
    });

    it('应该同时显示反应时间和性能评价（需求 6.5）', () => {
      const reactionTime = 350;
      const rating = '一般';
      
      uiRenderer.displayResult(reactionTime, rating);
      
      const text = resultDisplayElement.innerHTML || '';
      expect(text).toContain('350');
      expect(text).toContain('一般');
    });

    describe('增强反馈系统（需求 6.1-6.5）', () => {
      it('优秀评价应该显示"太快了！"文字', () => {
        uiRenderer.displayResult(150, '优秀');
        
        expect(resultDisplayElement.innerHTML).toContain('太快了！');
        expect(resultDisplayElement.innerHTML).toContain('excellent');
      });

      it('良好评价应该显示"不错！"文字', () => {
        uiRenderer.displayResult(250, '良好');
        
        expect(resultDisplayElement.innerHTML).toContain('不错！');
        expect(resultDisplayElement.innerHTML).toContain('good');
      });

      it('一般评价应该显示"继续加油！"文字', () => {
        uiRenderer.displayResult(350, '一般');
        
        expect(resultDisplayElement.innerHTML).toContain('继续加油！');
        expect(resultDisplayElement.innerHTML).toContain('average');
      });

      it('需要提高评价应该显示"再试一次！"文字', () => {
        uiRenderer.displayResult(450, '需要提高');
        
        expect(resultDisplayElement.innerHTML).toContain('再试一次！');
        expect(resultDisplayElement.innerHTML).toContain('needs-improvement');
      });

      it('优秀评价应该应用绿色闪光动画', () => {
        vi.useFakeTimers();
        
        uiRenderer.displayResult(150, '优秀');
        
        expect(colorBlockElement.className).toBe('feedback-excellent');
        
        vi.advanceTimersByTime(1200);
        expect(colorBlockElement.className).toBe('');
        
        vi.useRealTimers();
      });

      it('良好评价应该应用蓝色脉冲动画', () => {
        vi.useFakeTimers();
        
        uiRenderer.displayResult(250, '良好');
        
        expect(colorBlockElement.className).toBe('feedback-good');
        
        vi.advanceTimersByTime(1600);
        expect(colorBlockElement.className).toBe('');
        
        vi.useRealTimers();
      });

      it('一般评价应该应用黄色淡入淡出动画', () => {
        vi.useFakeTimers();
        
        uiRenderer.displayResult(350, '一般');
        
        expect(colorBlockElement.className).toBe('feedback-average');
        
        vi.advanceTimersByTime(2000);
        expect(colorBlockElement.className).toBe('');
        
        vi.useRealTimers();
      });

      it('需要提高评价应该应用橙色提示动画', () => {
        vi.useFakeTimers();
        
        uiRenderer.displayResult(450, '需要提高');
        
        expect(colorBlockElement.className).toBe('feedback-needs-improvement');
        
        vi.advanceTimersByTime(2000);
        expect(colorBlockElement.className).toBe('');
        
        vi.useRealTimers();
      });
    });
  });

  describe('displayMessage', () => {
    it('应该显示提示信息（需求 7.1）', () => {
      const message = '提前点击';
      
      uiRenderer.displayMessage(message);
      
      expect(messageDisplayElement.textContent).toBe(message);
    });

    it('应该能够显示任意消息', () => {
      const customMessage = '测试消息';
      
      uiRenderer.displayMessage(customMessage);
      
      expect(messageDisplayElement.textContent).toBe(customMessage);
    });
  });

  describe('displayInstructions', () => {
    it('应该显示游戏说明（需求 9.2）', () => {
      uiRenderer.displayInstructions();
      
      expect(messageDisplayElement.textContent).toBeTruthy();
      expect(messageDisplayElement.textContent?.length).toBeGreaterThan(0);
    });

    it('游戏说明应该包含操作提示', () => {
      uiRenderer.displayInstructions();
      
      const instructions = messageDisplayElement.textContent || '';
      expect(instructions).toMatch(/点击|色块|开始/);
    });
  });

  describe('辅助方法', () => {
    it('clearResult 应该清空结果显示', () => {
      uiRenderer.displayResult(200, '优秀');
      uiRenderer.clearResult();
      
      expect(resultDisplayElement.textContent).toBe('');
    });

    it('clearMessage 应该清空消息显示', () => {
      uiRenderer.displayMessage('测试消息');
      uiRenderer.clearMessage();
      
      expect(messageDisplayElement.textContent).toBe('');
    });

    it('getColorBlockElement 应该返回色块元素', () => {
      const element = uiRenderer.getColorBlockElement();
      
      expect(element).toBe(colorBlockElement);
      expect(element.id).toBe('color-block');
    });
  });
});
