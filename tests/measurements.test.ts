import { describe, it, expect } from 'vitest';
import { calculateDistance } from '../shared/gradingEngine';
import { Point2D } from '../shared/types';

describe('CAD Workspace Measurements Engine', () => {
  it('accurately computes Euclidean distance in millimeters and metric centimeters', () => {
    const p1: Point2D = { x: 0, y: 0 };
    const p2: Point2D = { x: 300, y: 400 };

    const distMm = calculateDistance(p1, p2);
    expect(distMm).toBe(500); // 3-4-5 right triangle

    const distCm = distMm / 10;
    expect(distCm).toBe(50);
  });

  it('measures seam line segment distances on pattern geometry', () => {
    const shoulderHPS: Point2D = { x: 95, y: 50 };
    const shoulderTip: Point2D = { x: 225, y: 92 };

    const shoulderLengthMm = calculateDistance(shoulderHPS, shoulderTip);
    // dx = 130, dy = 42 => sqrt(130^2 + 42^2) = sqrt(16900 + 1764) = sqrt(18664) ~ 136.6mm ~ 13.7cm
    expect(shoulderLengthMm).toBeCloseTo(136.6, 1);
  });

  it('handles identical points gracefully with 0 distance', () => {
    const p: Point2D = { x: 120, y: 250 };
    expect(calculateDistance(p, p)).toBe(0);
  });
});
