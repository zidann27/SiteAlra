import { useRef, useEffect, useState } from 'react';

/**
 * Hook scroll reveal — elemen fade+slide-up saat masuk viewport.
 * @param threshold  Persentase elemen harus terlihat sebelum trigger (0–1)
 * @param delay      Delay tambahan dalam ms (untuk stagger manual)
 */
export function useScrollReveal<T extends HTMLElement>(
  threshold = 0.12,
  delay = 0
) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        },
        { threshold }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, delay);
    return () => clearTimeout(timer);
  }, [threshold, delay]);

  return { ref, visible };
}

/** Style object siap pakai untuk animasi fade-up */
export function revealStyle(
  visible: boolean,
  delay = 0,
  duration = 650,
  distance = 30
): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : `translateY(${distance}px)`,
    transition: `opacity ${duration}ms ease, transform ${duration}ms ease`,
    transitionDelay: `${delay}ms`,
  };
}
