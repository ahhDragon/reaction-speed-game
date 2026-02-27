/**
 * 新手引导系统
 * 负责首次访问时的引导流程
 */
export class TutorialGuide {
  private currentStep: number = 0;
  private overlay: HTMLElement | null = null;
  private tooltip: HTMLElement | null = null;
  private hasCompletedTutorial: boolean = false;

  constructor() {
    // 检查是否已完成引导
    this.hasCompletedTutorial = localStorage.getItem('tutorial_completed') === 'true';
  }

  /**
   * 开始引导流程
   */
  start(): void {
    if (this.hasCompletedTutorial) {
      return;
    }

    this.currentStep = 0;
    this.createOverlay();
    this.showStep(0);
  }

  /**
   * 创建遮罩层
   */
  private createOverlay(): void {
    // 创建遮罩层
    this.overlay = document.createElement('div');
    this.overlay.id = 'tutorial-overlay';
    this.overlay.className = 'tutorial-overlay';
    document.body.appendChild(this.overlay);

    // 创建气泡提示
    this.tooltip = document.createElement('div');
    this.tooltip.id = 'tutorial-tooltip';
    this.tooltip.className = 'tutorial-tooltip';
    document.body.appendChild(this.tooltip);

    // 点击任意位置进入下一步
    this.overlay.addEventListener('click', () => this.nextStep());
    this.tooltip.addEventListener('click', () => this.nextStep());
  }

  /**
   * 显示指定步骤
   */
  private showStep(step: number): void {
    if (!this.overlay || !this.tooltip) return;

    const steps: Array<{
      target: string;
      message: string;
      position: 'top' | 'bottom';
    }> = [
      {
        target: '#color-block',
        message: '<img src="./assets/images/fatgoose_icon.png" alt="胖鹅" class="tutorial-goose-icon"> 嘎嘎！欢迎来到胖鹅测反应～点击这个色块就能开始游戏啦！',
        position: 'bottom'
      },
      {
        target: '#rating-guide',
        message: '<img src="./assets/images/fatgoose_icon.png" alt="胖鹅" class="tutorial-goose-icon"> 这里可以看到评分标准哦～看看你能拿到什么等级！',
        position: 'top'
      },
      {
        target: '#goose-mode-btn',
        message: '<img src="./assets/images/fatgoose_icon.png" alt="胖鹅" class="tutorial-goose-icon"> 嘘...这里藏着一个神秘的特别模式，要不要试试？',
        position: 'bottom'
      }
    ];

    if (step >= steps.length) {
      this.complete();
      return;
    }

    const currentStep = steps[step];
    const targetElement = document.querySelector(currentStep.target) as HTMLElement;

    if (!targetElement) {
      this.complete();
      return;
    }

    // 高亮目标元素
    this.highlightElement(targetElement);

    // 显示气泡提示
    this.showTooltip(targetElement, currentStep.message, currentStep.position);
  }

  /**
   * 高亮元素
   */
  private highlightElement(element: HTMLElement): void {
    if (!this.overlay) return;

    const rect = element.getBoundingClientRect();
    
    // 设置遮罩层的镂空效果
    this.overlay.style.clipPath = `polygon(
      0% 0%,
      0% 100%,
      ${rect.left - 10}px 100%,
      ${rect.left - 10}px ${rect.top - 10}px,
      ${rect.right + 10}px ${rect.top - 10}px,
      ${rect.right + 10}px ${rect.bottom + 10}px,
      ${rect.left - 10}px ${rect.bottom + 10}px,
      ${rect.left - 10}px 100%,
      100% 100%,
      100% 0%
    )`;

    // 移除之前的高亮和事件监听
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
      el.classList.remove('tutorial-highlight');
      const oldHandler = (el as any)._tutorialClickHandler;
      if (oldHandler) {
        el.removeEventListener('click', oldHandler, true);
        delete (el as any)._tutorialClickHandler;
      }
    });
    
    // 为目标元素添加高亮类和点击事件
    element.classList.add('tutorial-highlight');
    
    // 阻止高亮元素的默认行为，只允许进入下一步
    const clickHandler = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      this.nextStep();
    };
    
    element.addEventListener('click', clickHandler, true);
    
    // 保存事件处理器以便后续清理
    (element as any)._tutorialClickHandler = clickHandler;
  }

  /**
   * 显示气泡提示
   */
  private showTooltip(targetElement: HTMLElement, message: string, position: 'top' | 'bottom'): void {
    if (!this.tooltip) return;

    this.tooltip.innerHTML = `
      <div class="tutorial-tooltip-content">
        ${message}
      </div>
    `;

    const rect = targetElement.getBoundingClientRect();
    const tooltipRect = this.tooltip.getBoundingClientRect();

    let top: number;
    let left: number;

    if (position === 'bottom') {
      top = rect.bottom + 20;
      left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    } else {
      top = rect.top - tooltipRect.height - 20;
      left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    }

    // 确保气泡不超出屏幕
    left = Math.max(10, Math.min(left, window.innerWidth - tooltipRect.width - 10));

    this.tooltip.style.top = `${top}px`;
    this.tooltip.style.left = `${left}px`;
    this.tooltip.style.opacity = '1';
    this.tooltip.style.transform = 'translateY(0)';
  }

  /**
   * 进入下一步
   */
  private nextStep(): void {
    this.currentStep++;
    this.showStep(this.currentStep);
  }

  /**
   * 完成引导
   */
  private complete(): void {
    // 移除遮罩和气泡
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
    if (this.tooltip) {
      this.tooltip.remove();
      this.tooltip = null;
    }

    // 移除高亮类和事件监听
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
      el.classList.remove('tutorial-highlight');
      const handler = (el as any)._tutorialClickHandler;
      if (handler) {
        el.removeEventListener('click', handler, true);
        delete (el as any)._tutorialClickHandler;
      }
    });

    // 标记为已完成
    localStorage.setItem('tutorial_completed', 'true');
    this.hasCompletedTutorial = true;
  }

  /**
   * 重置引导（用于测试）
   */
  reset(): void {
    localStorage.removeItem('tutorial_completed');
    this.hasCompletedTutorial = false;
  }
}
