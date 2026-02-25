/**
 * 负责渲染用户界面
 */
export interface UIRenderer {
  /**
   * 渲染色块
   * @param color 色块颜色
   */
  renderColorBlock(color: string): void;
  
  /**
   * 设置初始状态样式（呼吸动画和文字提示）
   */
  setInitialState(): void;
  
  /**
   * 移除初始状态样式
   */
  removeInitialState(): void;
  
  /**
   * 显示反应时间和评价
   * @param reactionTime 反应时间（毫秒）
   * @param rating 性能评价
   */
  displayResult(reactionTime: number, rating: string): void;
  
  /**
   * 显示提示信息
   * @param message 提示信息内容
   */
  displayMessage(message: string): void;
  
  /**
   * 显示游戏说明
   */
  displayInstructions(): void;
}
