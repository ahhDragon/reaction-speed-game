/**
 * 音效管理器
 * 使用 Web Audio API 生成游戏音效
 */
export class AudioManager {
  private audioContext: AudioContext | null = null;
  private isEnabled: boolean = true;

  constructor() {
    // 延迟初始化 AudioContext，避免浏览器自动播放策略问题
    this.initializeAudio();
  }

  /**
   * 初始化音频上下文
   */
  private initializeAudio(): void {
    try {
      // 检查浏览器支持
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioContext = new AudioContextClass();
      }
    } catch (error) {
      console.warn('Audio not supported:', error);
      this.isEnabled = false;
    }
  }

  /**
   * 确保音频上下文已启动（用户交互后）
   */
  private async ensureAudioContext(): Promise<void> {
    if (!this.audioContext || !this.isEnabled) return;

    if (this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.warn('Failed to resume audio context:', error);
      }
    }
  }

  /**
   * 播放点击音效
   */
  async playClickSound(): Promise<void> {
    await this.playTone(800, 0.1, 'sine', 0.3);
  }

  /**
   * 播放色块变色音效
   */
  async playColorChangeSound(): Promise<void> {
    await this.playTone(1200, 0.15, 'triangle', 0.4);
  }

  /**
   * 播放成功音效（根据评级）
   */
  async playSuccessSound(rating: string): Promise<void> {
    switch (rating) {
      case '神速胖鹅':
        // 神速：高音快速三连音
        await this.playChord([1600, 2000, 2400], 0.3, 'sine', 0.5);
        break;
      case '闪电胖鹅':
        // 闪电：双音上升
        await this.playSequence([
          { frequency: 1200, duration: 0.1 },
          { frequency: 1600, duration: 0.2 }
        ], 'triangle', 0.4);
        break;
      case '敏捷胖鹅':
        // 敏捷：清脆单音
        await this.playTone(1400, 0.25, 'sine', 0.4);
        break;
      case '稳健胖鹅':
        // 稳健：温和双音
        await this.playSequence([
          { frequency: 1000, duration: 0.15 },
          { frequency: 1200, duration: 0.15 }
        ], 'triangle', 0.3);
        break;
      case '悠闲胖鹅':
        // 悠闲：低音单调
        await this.playTone(800, 0.3, 'sine', 0.3);
        break;
      case '迟钝胖鹅':
        // 迟钝：更低的音
        await this.playTone(600, 0.4, 'triangle', 0.25);
        break;
      case '笨拙胖鹅':
        // 笨拙：低沉的"嘟嘟"声
        await this.playSequence([
          { frequency: 400, duration: 0.2 },
          { frequency: 350, duration: 0.3 }
        ], 'sawtooth', 0.2);
        break;
      default:
        await this.playTone(1000, 0.2, 'sine', 0.3);
    }
  }

  /**
   * 播放提前点击音效
   */
  async playEarlyClickSound(): Promise<void> {
    // 错误音效：低音下降
    await this.playSequence([
      { frequency: 600, duration: 0.1 },
      { frequency: 400, duration: 0.2 },
      { frequency: 300, duration: 0.2 }
    ], 'sawtooth', 0.3);
  }

  /**
   * 播放大胖鹅模式切换音效
   */
  async playGooseModeSound(): Promise<void> {
    // 鹅叫声模拟：快速频率变化
    await this.playSequence([
      { frequency: 800, duration: 0.1 },
      { frequency: 600, duration: 0.1 },
      { frequency: 800, duration: 0.1 },
      { frequency: 600, duration: 0.1 }
    ], 'square', 0.4);
  }

  /**
   * 播放倒计时滴答音效
   */
  async playTickSound(): Promise<void> {
    await this.playTone(1000, 0.05, 'square', 0.2);
  }

  /**
   * 播放单个音调
   */
  private async playTone(
    frequency: number, 
    duration: number, 
    waveType: OscillatorType = 'sine',
    volume: number = 0.3
  ): Promise<void> {
    await this.ensureAudioContext();
    if (!this.audioContext || !this.isEnabled) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = waveType;

      // 音量包络：快速上升，缓慢下降
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Failed to play tone:', error);
    }
  }

  /**
   * 播放和弦
   */
  private async playChord(
    frequencies: number[], 
    duration: number, 
    waveType: OscillatorType = 'sine',
    volume: number = 0.3
  ): Promise<void> {
    const promises = frequencies.map(freq => 
      this.playTone(freq, duration, waveType, volume / frequencies.length)
    );
    await Promise.all(promises);
  }

  /**
   * 播放音序
   */
  private async playSequence(
    notes: Array<{ frequency: number; duration: number }>,
    waveType: OscillatorType = 'sine',
    volume: number = 0.3
  ): Promise<void> {
    let currentTime = 0;
    for (const note of notes) {
      setTimeout(() => {
        this.playTone(note.frequency, note.duration, waveType, volume);
      }, currentTime * 1000);
      currentTime += note.duration;
    }
  }

  /**
   * 启用/禁用音效
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * 获取音效状态
   */
  isAudioEnabled(): boolean {
    return this.isEnabled && this.audioContext !== null;
  }
}