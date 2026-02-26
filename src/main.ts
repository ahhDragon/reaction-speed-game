import { GameController } from './GameController';
import { TutorialGuide } from './services/TutorialGuide';

/**
 * 主入口文件
 * 在 DOM 加载完成后初始化游戏
 */
document.addEventListener('DOMContentLoaded', () => {
  try {
    const gameController = new GameController();
    gameController.initialize();
    
    // 启动新手引导
    const tutorial = new TutorialGuide();
    setTimeout(() => {
      tutorial.start();
    }, 500); // 延迟500ms启动，确保页面完全加载
    
    // 开发时可以通过控制台重置引导：window.resetTutorial()
    (window as any).resetTutorial = () => {
      tutorial.reset();
      window.location.reload();
    };
  } catch (error) {
    console.error('Failed to initialize game:', error);
    alert('游戏初始化失败，请刷新页面重试。');
  }
});
