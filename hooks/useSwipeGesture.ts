import { useEffect, useRef } from 'react';

interface SwipeGestureProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
}

export function useSwipeGesture({ onSwipeLeft, onSwipeRight, threshold = 50 }: SwipeGestureProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStart.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStart.current) return;

      const touch = e.touches[0];
      const diffX = touch.clientX - touchStart.current.x;
      const diffY = touch.clientY - touchStart.current.y;

      // If the movement is primarily horizontal, prevent browser-level default behaviors
      // like iOS elastic horizontal overscroll and history-back navigation.
      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (e.cancelable) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;

      const touch = e.changedTouches[0];
      const diffX = touch.clientX - touchStart.current.x;
      const diffY = touch.clientY - touchStart.current.y;

      touchStart.current = null;

      // Check if swipe is mainly horizontal and exceeds the threshold
      if (Math.abs(diffX) > threshold && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
        if (diffX > 0) {
          // Swiped from left to right
          onSwipeRight?.();
        } else {
          // Swiped from right to left
          onSwipeLeft?.();
        }
      }
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, threshold]);

  return containerRef;
}

