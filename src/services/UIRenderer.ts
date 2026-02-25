import { UIRenderer as IUIRenderer } from '../interfaces/UIRenderer';
import { defaultGameConfig } from '../config/gameConfig';

/**
 * UI 渲染器实现
 * 负责渲染色块、显示结果和消息提示
 */
export class UIRenderer implements IUIRenderer {
  private colorBlockElement: HTMLElement;
  private resultDisplayElement: HTMLElement;
  private messageDisplayElement: HTMLElement;

  constructor() {
    // 获取 DOM 元素
    const colorBlock = document.getElementById('color-block');
    const resultDisplay = document.getElementById('result-display');
    const messageDisplay = document.getElementById('message-display');

    // 验证 DOM 元素是否存在
    if (!colorBlock || !resultDisplay || !messageDisplay) {
      throw new Error('Required DOM elements not found');
    }

    this.colorBlockElement = colorBlock;
    this.resultDisplayElement = resultDisplay;
    this.messageDisplayElement = messageDisplay;

    // 初始化色块尺寸
    this.initializeColorBlock();
  }

  /**
   * 初始化色块尺寸和样式
   * 确保色块满足最小尺寸要求（需求 1.2）
   */
  private initializeColorBlock(): void {
    const { width, height } = defaultGameConfig.blockSize;
    this.colorBlockElement.style.width = `${width}px`;
    this.colorBlockElement.style.height = `${height}px`;
  }

  /**
   * 渲染色块
   * 设置色块的背景颜色
   * 
   * @param color 色块颜色（十六进制颜色值）
   * 
   * 需求：
   * - 1.1: 在网页中心显示色块
   * - 1.2: 色块占据至少 200x200 像素
   * - 1.3: 色块具有明显边界
   */
  renderColorBlock(color: string): void {
    this.colorBlockElement.style.backgroundColor = color;
  }

  /**
   * 设置初始状态样式（呼吸动画和文字提示）
   */
  setInitialState(): void {
    this.colorBlockElement.classList.add('initial-state');
  }

  /**
   * 移除初始状态样式
   */
  removeInitialState(): void {
    this.colorBlockElement.classList.remove('initial-state');
  }

  /**
   * 显示反应时间和评价（带增强反馈）
   * 
   * @param reactionTime 反应时间（毫秒）
   * @param rating 性能评价
   * 
   * 需求：
   * - 4.2: 以毫秒为单位显示反应时间
   * - 5.1: 在屏幕上显示反应时间
   * - 5.2: 显示反应时间的单位
   * - 6.1-6.5: 性能评价和增强反馈
   */
  displayResult(reactionTime: number, rating: string): void {
    // 获取反馈文字和样式类
    const feedbackInfo = this.getFeedbackInfo(rating);
    
    // 显示反应时间和评价
    this.resultDisplayElement.innerHTML = 
      `反应时间: ${reactionTime} 毫秒 - ${rating}<span class="feedback-text ${feedbackInfo.textClass}">${feedbackInfo.text}</span>`;
    
    // 应用动画效果到色块
    this.applyFeedbackAnimation(feedbackInfo.animationClass);
  }

  /**
   * 根据性能评价获取反馈信息
   * 
   * @param rating 性能评价
   * @returns 反馈文字和样式类信息
   */
  private getFeedbackInfo(rating: string): { text: string; textClass: string; animationClass: string } {
    switch (rating) {
      case '优秀':
        return {
          text: '太快了！',
          textClass: 'excellent',
          animationClass: 'feedback-excellent'
        };
      case '良好':
        return {
          text: '不错！',
          textClass: 'good',
          animationClass: 'feedback-good'
        };
      case '一般':
        return {
          text: '继续加油！',
          textClass: 'average',
          animationClass: 'feedback-average'
        };
      case '需要提高':
        return {
          text: '再试一次！',
          textClass: 'needs-improvement',
          animationClass: 'feedback-needs-improvement'
        };
      default:
        return {
          text: '',
          textClass: '',
          animationClass: ''
        };
    }
  }

  /**
   * 应用反馈动画到色块
   * 
   * @param animationClass 动画样式类名
   */
  private applyFeedbackAnimation(animationClass: string): void {
    // 移除之前的动画类
    this.colorBlockElement.className = '';
    
    // 添加新的动画类
    if (animationClass) {
      this.colorBlockElement.classList.add(animationClass);
      
      // 动画结束后移除类，以便下次可以重新触发
      const animationDuration = this.getAnimationDuration(animationClass);
      setTimeout(() => {
        this.colorBlockElement.classList.remove(animationClass);
      }, animationDuration);
    }
  }

  /**
   * 获取动画持续时间（毫秒）
   * 
   * @param animationClass 动画样式类名
   * @returns 动画持续时间
   */
  private getAnimationDuration(animationClass: string): number {
    switch (animationClass) {
      case 'feedback-excellent':
        return 1200; // 0.6s * 2 iterations
      case 'feedback-good':
        return 1600; // 0.8s * 2 iterations
      case 'feedback-average':
        return 2000; // 1s * 2 iterations
      case 'feedback-needs-improvement':
        return 2000; // 1s * 2 iterations
      default:
        return 0;
    }
  }

  /**
   * 显示提示信息
   * 
   * @param message 提示信息内容
   * 
   * 需求：
   * - 7.1: 显示"提前点击"提示信息
   */
  displayMessage(message: string): void {
    this.messageDisplayElement.textContent = message;
  }

  /**
   * 显示游戏说明
   * 
   * 需求：
   * - 9.2: 网页加载完成时显示游戏说明
   */
  displayInstructions(): void {
    this.messageDisplayElement.textContent = 
      '点击色块开始游戏。等待色块变绿后尽快点击！';
  }

  /**
   * 清空结果显示
   */
  clearResult(): void {
    this.resultDisplayElement.textContent = '';
  }

  /**
   * 清空消息显示
   */
  clearMessage(): void {
    this.messageDisplayElement.textContent = '';
  }

  /**
   * 获取色块元素（用于事件监听）
   */
  getColorBlockElement(): HTMLElement {
    return this.colorBlockElement;
  }
}
