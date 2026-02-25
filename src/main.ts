import { GameController } from './GameController';

/**
 * 主入口文件
 * 在 DOM 加载完成后初始化游戏
 */
document.addEventListener('DOMContentLoaded', () => {
  try {
    const gameController = new GameController();
    gameController.initialize();
  } catch (error) {
    console.error('Failed to initialize game:', error);
    alert('游戏初始化失败，请刷新页面重试。');
  }
});
