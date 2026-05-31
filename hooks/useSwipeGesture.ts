import React, { useRef } from 'react';

interface SwipeGestureProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
}

export function useSwipeGesture({ onSwipeLeft, onSwipeRight, threshold = 60 }: SwipeGestureProps) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;

    const touch = e.changedTouches[0];
    const diffX = touch.clientX - touchStart.current.x;
    const diffY = touch.clientY - touchStart.current.y;

    touchStart.current = null;

    // Check if swipe is mainly horizontal
    if (Math.abs(diffX) > threshold && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
      if (diffX > 0) {
        // Swiped from left to right -> trigger onSwipeRight
        onSwipeRight?.();
      } else {
        // Swiped from right to left -> trigger onSwipeLeft
        onSwipeLeft?.();
      }
    }
  };

  return {
    onTouchStart,
    onTouchEnd,
  };
}
