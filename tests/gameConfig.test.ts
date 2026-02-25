import { describe, it, expect } from 'vitest';
import { defaultGameConfig, performanceThresholds } from '../src/config/gameConfig';

describe('GameConfig', () => {
  describe('色块尺寸配置', () => {
    it('应该满足最小尺寸要求（至少 200x200 像素）', () => {
      // 需求 1.2: 色块应占据至少 200x200 像素的区域
      expect(defaultGameConfig.blockSize.width).toBeGreaterThanOrEqual(200);
      expect(defaultGameConfig.blockSize.height).toBeGreaterThanOrEqual(200);
    });
  });

  describe('颜色配置', () => {
    it('应该定义初始颜色和变化后颜色', () => {
      // 需求 2.3: 系统应使用至少两种视觉上有明显区别的颜色
      expect(defaultGameConfig.colors.initial).toBeDefined();
      expect(defaultGameConfig.colors.changed).toBeDefined();
      expect(defaultGameConfig.colors.initial).not.toBe(defaultGameConfig.colors.changed);
    });

    it('颜色应该是有效的 CSS 颜色值', () => {
      // 验证颜色格式
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
      expect(defaultGameConfig.colors.initial).toMatch(hexColorRegex);
      expect(defaultGameConfig.colors.changed).toMatch(hexColorRegex);
    });
  });

  describe('等待时间范围配置', () => {
    it('应该定义 1000-5000ms 的等待时间范围', () => {
      // 需求 2.1: 系统应设置一个 1000 毫秒到 5000 毫秒之间的随机等待期
      expect(defaultGameConfig.waitingPeriodRange.min).toBe(1000);
      expect(defaultGameConfig.waitingPeriodRange.max).toBe(5000);
    });

    it('最小值应该小于最大值', () => {
      expect(defaultGameConfig.waitingPeriodRange.min).toBeLessThan(
        defaultGameConfig.waitingPeriodRange.max
      );
    });
  });

  describe('轮次间隔配置', () => {
    it('应该定义至少 1000ms 的轮次间隔', () => {
      // 需求 8.3: 系统应在每个游戏轮次之间提供至少 1000 毫秒的间隔
      expect(defaultGameConfig.roundInterval).toBeGreaterThanOrEqual(1000);
    });
  });

  describe('提前点击提示显示时间配置', () => {
    it('应该定义至少 1000ms 的提示显示时间', () => {
      // 需求 7.3: 系统应在重新开始前显示提前点击提示至少 1000 毫秒
      expect(defaultGameConfig.earlyClickMessageDuration).toBeGreaterThanOrEqual(1000);
    });
  });

  describe('性能评价阈值配置', () => {
    it('应该定义优秀阈值为 200ms', () => {
      // 需求 6.1: 当反应时间小于 200 毫秒时，系统应显示"优秀"
      expect(performanceThresholds.excellent).toBe(200);
    });

    it('应该定义良好阈值为 300ms', () => {
      // 需求 6.2: 当反应时间在 200 到 300 毫秒之间时，系统应显示"良好"
      expect(performanceThresholds.good).toBe(300);
    });

    it('应该定义一般阈值为 400ms', () => {
      // 需求 6.3: 当反应时间在 300 到 400 毫秒之间时，系统应显示"一般"
      expect(performanceThresholds.average).toBe(400);
    });

    it('阈值应该按递增顺序排列', () => {
      expect(performanceThresholds.excellent).toBeLessThan(performanceThresholds.good);
      expect(performanceThresholds.good).toBeLessThan(performanceThresholds.average);
    });
  });

  describe('配置完整性', () => {
    it('应该包含所有必需的配置项', () => {
      expect(defaultGameConfig).toHaveProperty('blockSize');
      expect(defaultGameConfig).toHaveProperty('colors');
      expect(defaultGameConfig).toHaveProperty('waitingPeriodRange');
      expect(defaultGameConfig).toHaveProperty('roundInterval');
      expect(defaultGameConfig).toHaveProperty('earlyClickMessageDuration');
    });
  });
});
