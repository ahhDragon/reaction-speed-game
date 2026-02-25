import { GameController as IGameController } from './interfaces/GameController';
import { StateManager } from './services/StateManager';
import { TimerService } from './services/TimerService';
import { UIRenderer } from './services/UIRenderer';
import { calculatePerformanceRating } from './services/PerformanceEvaluator';
import { GameState } from './types/GameState';
import { GameRound } from './types/GameRound';
import { defaultGameConfig } from './config/gameConfig';

/**
 * 游戏控制器实现
 * 协调整个游戏流程，管理游戏状态转换
 */
export class GameController implements IGameController {
  private stateManager: StateManager;
  private timerService: TimerService;
  private uiRenderer: UIRenderer;
  private currentRound: GameRound | null = null;

  constructor() {
    this.stateManager = new StateManager();
    this.timerService = new TimerService();
    this.uiRenderer = new UIRenderer();
  }

  /**
   * 初始化游戏
   * 
   * 需求：
   * - 9.1: 网页加载完成时显示初始状态的色块
   * - 9.2: 网页加载完成时显示游戏说明
   */
  initialize(): void {
    // 显示初始状态的色块（红色）
    this.uiRenderer.renderColorBlock(defaultGameConfig.colors.initial);
    
    // 设置初始状态样式（呼吸动画和文字提示）
    this.uiRenderer.setInitialState();
    
    // 显示游戏说明
    this.uiRenderer.displayInstructions();
    
    // 设置点击事件监听器
    const colorBlockElement = this.uiRenderer.getColorBlockElement();
    colorBlockElement.addEventListener('click', () => this.handleClick());
    
    // 订阅状态变化
    this.stateManager.onStateChange((state) => this.onStateChange(state));
  }

  /**
   * 开始新一轮游戏
   * 
   * 需求：
   * - 2.1: 设置 1000-5000ms 之间的随机等待时间
   * - 2.2: 等待期结束后改变色块颜色
   * - 2.4: 记录颜色变化的精确时间戳
   * - 8.2: 重置色块到初始颜色
   */
  startRound(): void {
    // 生成随机等待时间（1000-5000ms）
    const { min, max } = defaultGameConfig.waitingPeriodRange;
    const waitingPeriod = Math.floor(Math.random() * (max - min + 1)) + min;

    // 初始化新的游戏轮次数据
    this.currentRound = {
      colorChangeTimestamp: null,
      clickTimestamp: null,
      reactionTime: null,
      waitingPeriod: waitingPeriod,
      currentColor: defaultGameConfig.colors.initial
    };

    // 重置色块到初始颜色（红色）
    this.uiRenderer.renderColorBlock(defaultGameConfig.colors.initial);
    
    // 清空之前的结果显示
    this.uiRenderer.clearResult();
    
    // 显示等待提示信息
    this.uiRenderer.displayMessage('等待色块变绿后尽快点击');

    // 设置状态为 WAITING
    this.stateManager.setState(GameState.WAITING);

    // 在等待期结束后改变色块颜色
    this.timerService.setDelay(() => {
      // 改变色块颜色为绿色
      this.uiRenderer.renderColorBlock(defaultGameConfig.colors.changed);
      
      // 显示快速点击提示
      this.uiRenderer.displayMessage('快点击色块！！');
      
      // 记录颜色变化的时间戳
      if (this.currentRound) {
        this.currentRound.colorChangeTimestamp = this.timerService.getCurrentTimestamp();
        this.currentRound.currentColor = defaultGameConfig.colors.changed;
      }
      
      // 设置状态为 READY（准备点击）
      this.stateManager.setState(GameState.READY);
    }, waitingPeriod);
  }

  /**
   * 处理玩家点击
   * 
   * 需求：
   * - 3.1: 记录点击的精确时间戳
   * - 3.2: 识别提前点击
   * - 3.3: 计算反应时间
   * - 3.4: 验证点击是否在色块区域内
   * - 7.1: 显示"提前点击"提示信息
   * - 7.2: 提前点击后重新开始游戏
   * - 9.3: 首次点击启动游戏
   */
  handleClick(): void {
    const currentState = this.stateManager.getCurrentState();

    // 根据当前状态处理点击
    switch (currentState) {
      case GameState.INITIAL:
        // 首次点击，开始第一轮游戏（需求 9.3）
        // 移除初始状态样式
        this.uiRenderer.removeInitialState();
        this.startRound();
        break;

      case GameState.WAITING:
        // 提前点击（需求 3.2, 7.1, 7.2）
        this.handleEarlyClick();
        break;

      case GameState.READY:
        // 正常点击，记录时间并计算反应时间（需求 3.1, 3.3）
        this.handleValidClick();
        break;

      case GameState.RESULT:
        // 结果显示后，玩家点击继续下一轮
        this.startRound();
        break;

      case GameState.EARLY_CLICK:
        // 在这些状态下忽略点击
        break;

      default:
        // 未知状态，忽略点击
        break;
    }
  }

  /**
   * 重置游戏状态
   */
  reset(): void {
    // TODO: 实现重置功能
    throw new Error('Method not implemented.');
  }

  /**
   * 处理提前点击
   * 
   * 需求：
   * - 7.1: 显示"提前点击"提示信息
   * - 7.2: 重新开始当前游戏轮次
   * - 7.3: 提示显示至少 1000ms
   */
  private handleEarlyClick(): void {
    // 取消当前的等待定时器
    this.timerService.cancelDelay();

    // 设置状态为 EARLY_CLICK
    this.stateManager.setState(GameState.EARLY_CLICK);

    // 显示提前点击提示信息
    this.uiRenderer.displayMessage('提前点击！请等待色块变绿后再点击。');

    // 延迟 2000ms 后回到初始状态
    this.timerService.setDelay(() => {
      // 回到初始状态
      this.stateManager.setState(GameState.INITIAL);
      
      // 重置色块到初始颜色
      this.uiRenderer.renderColorBlock(defaultGameConfig.colors.initial);
      
      // 设置初始状态样式（呼吸动画和文字提示）
      this.uiRenderer.setInitialState();
      
      // 显示游戏说明
      this.uiRenderer.displayInstructions();
    }, 2000); // 提示显示 2 秒
  }

  /**
   * 处理有效点击（在 READY 状态下的点击）
   * 
   * 需求：
   * - 3.1: 记录点击时间戳
   * - 3.3: 计算反应时间
   * - 4.1: 反应时间 = 点击时间戳 - 颜色变化时间戳
   * - 4.3: 立即显示反应时间
   * - 5.1-5.3: 显示结果
   * - 6.5: 同时显示反应时间和性能评价
   */
  private handleValidClick(): void {
    if (!this.currentRound || this.currentRound.colorChangeTimestamp === null) {
      // 数据异常，重新开始游戏
      console.error('Invalid game round data');
      this.startRound();
      return;
    }

    // 记录点击时间戳（需求 3.1）
    this.currentRound.clickTimestamp = this.timerService.getCurrentTimestamp();

    // 计算反应时间（需求 3.3, 4.1）
    this.currentRound.reactionTime = 
      this.currentRound.clickTimestamp - this.currentRound.colorChangeTimestamp;

    // 获取性能评价
    const rating = calculatePerformanceRating(this.currentRound.reactionTime);

    // 显示结果（需求 4.3, 5.1-5.3, 6.5）
    this.uiRenderer.displayResult(this.currentRound.reactionTime, rating);

    // 设置状态为 RESULT
    this.stateManager.setState(GameState.RESULT);

    // 显示提示信息，等待玩家点击继续
    this.uiRenderer.displayMessage('点击色块继续下一轮');
  }

  /**
   * 状态变化处理器
   * @param state 新的游戏状态
   */
  private onStateChange(state: GameState): void {
    // TODO: 根据状态变化执行相应的操作
  }
}
