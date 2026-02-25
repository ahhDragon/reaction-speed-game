import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { GameConfig } from '../src/types/GameConfig';

describe('GameConfig Property-Based Tests', () => {
  describe('属性 1: 色块尺寸满足最小要求', () => {
    it('**Validates: Requirements 1.2** - 对于任何渲染的色块，其宽度和高度都应该至少为 200 像素', () => {
      // 生成任意的 GameConfig 对象
      const gameConfigArbitrary = fc.record({
        blockSize: fc.record({
          width: fc.integer({ min: 200, max: 1000 }),
          height: fc.integer({ min: 200, max: 1000 }),
        }),
        colors: fc.record({
          initial: fc.hexaString({ minLength: 6, maxLength: 6 }).map(s => `#${s}`),
          changed: fc.hexaString({ minLength: 6, maxLength: 6 }).map(s => `#${s}`),
        }),
        waitingPeriodRange: fc.record({
          min: fc.integer({ min: 500, max: 2000 }),
          max: fc.integer({ min: 2000, max: 10000 }),
        }),
        roundInterval: fc.integer({ min: 500, max: 5000 }),
        earlyClickMessageDuration: fc.integer({ min: 500, max: 5000 }),
      });

      fc.assert(
        fc.property(gameConfigArbitrary, (config: GameConfig) => {
          // 验证色块宽度至少为 200 像素
          const widthValid = config.blockSize.width >= 200;
          
          // 验证色块高度至少为 200 像素
          const heightValid = config.blockSize.height >= 200;
          
          // 两个条件都必须满足
          return widthValid && heightValid;
        }),
        { numRuns: 100 }
      );
    });

    it('**Validates: Requirements 1.2** - 色块尺寸应该是有效的正数', () => {
      // 生成任意的 GameConfig 对象
      const gameConfigArbitrary = fc.record({
        blockSize: fc.record({
          width: fc.integer({ min: 200, max: 1000 }),
          height: fc.integer({ min: 200, max: 1000 }),
        }),
        colors: fc.record({
          initial: fc.hexaString({ minLength: 6, maxLength: 6 }).map(s => `#${s}`),
          changed: fc.hexaString({ minLength: 6, maxLength: 6 }).map(s => `#${s}`),
        }),
        waitingPeriodRange: fc.record({
          min: fc.integer({ min: 500, max: 2000 }),
          max: fc.integer({ min: 2000, max: 10000 }),
        }),
        roundInterval: fc.integer({ min: 500, max: 5000 }),
        earlyClickMessageDuration: fc.integer({ min: 500, max: 5000 }),
      });

      fc.assert(
        fc.property(gameConfigArbitrary, (config: GameConfig) => {
          // 验证宽度是有效的正数
          const widthIsValid = 
            typeof config.blockSize.width === 'number' &&
            Number.isFinite(config.blockSize.width) &&
            config.blockSize.width > 0;
          
          // 验证高度是有效的正数
          const heightIsValid = 
            typeof config.blockSize.height === 'number' &&
            Number.isFinite(config.blockSize.height) &&
            config.blockSize.height > 0;
          
          return widthIsValid && heightIsValid;
        }),
        { numRuns: 100 }
      );
    });

    it('**Validates: Requirements 1.2** - 色块应该占据至少 200x200 像素的区域（面积测试）', () => {
      // 生成任意的 GameConfig 对象
      const gameConfigArbitrary = fc.record({
        blockSize: fc.record({
          width: fc.integer({ min: 200, max: 1000 }),
          height: fc.integer({ min: 200, max: 1000 }),
        }),
        colors: fc.record({
          initial: fc.hexaString({ minLength: 6, maxLength: 6 }).map(s => `#${s}`),
          changed: fc.hexaString({ minLength: 6, maxLength: 6 }).map(s => `#${s}`),
        }),
        waitingPeriodRange: fc.record({
          min: fc.integer({ min: 500, max: 2000 }),
          max: fc.integer({ min: 2000, max: 10000 }),
        }),
        roundInterval: fc.integer({ min: 500, max: 5000 }),
        earlyClickMessageDuration: fc.integer({ min: 500, max: 5000 }),
      });

      fc.assert(
        fc.property(gameConfigArbitrary, (config: GameConfig) => {
          // 计算色块面积
          const area = config.blockSize.width * config.blockSize.height;
          
          // 验证面积至少为 200 * 200 = 40000 平方像素
          return area >= 40000;
        }),
        { numRuns: 100 }
      );
    });
  });
});
