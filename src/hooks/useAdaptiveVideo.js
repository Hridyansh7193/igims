import { useState, useEffect, useRef, useCallback } from 'react';
import { useIsNarrow } from './useIsNarrow';

/**
 * Coordinates adaptive, policy-aware background video delivery:
 * - Defers video source attachment until `enabled` is true (e.g. intro dismissed)
 *   AND the host container approaches/enters the viewport.
 * - Keeps the video mounted once activated so scrolling up/down doesn't re-fetch,
 *   while pausing off-screen playback to save CPU/battery.
 * - Falls back cleanly to a static poster when reduced-motion, Data Saver,
 *   or restricted browser autoplay prevents playback.
 */
export function useAdaptiveVideo({ enabled = true, rootMargin = '0px', threshold = 0.05 } = {}) {
  const isMobile = useIsNarrow(768);
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const [saveData] = useState(() => {
    if (typeof navigator === 'undefined') return false;
    return Boolean(navigator.connection && navigator.connection.saveData);
  });

  const [isInView, setIsInView] = useState(false);
  const [hasActivated, setHasActivated] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setPrefersReducedMotion(e.matches);
    setPrefersReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setIsInView(entry.isIntersecting);
      },
      { rootMargin, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  const policyAllowsVideo = enabled && !prefersReducedMotion && !saveData && !autoplayBlocked;

  useEffect(() => {
    if (policyAllowsVideo && isInView && !hasActivated) {
      setHasActivated(true);
    }
  }, [policyAllowsVideo, isInView, hasActivated]);

  const shouldLoadVideo = policyAllowsVideo && hasActivated;

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !shouldLoadVideo) return;

    if (isInView) {
      const playPromise = vid.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch((err) => {
          // Restricted autoplay (e.g. battery saver / browser policy): keep clean poster
          setVideoReady(false);
          if (err && err.name === 'NotAllowedError') {
            setAutoplayBlocked(true);
          }
        });
      }
    } else if (!vid.paused) {
      vid.pause();
    }
  }, [shouldLoadVideo, isInView]);

  const handlePlaying = useCallback(() => {
    setVideoReady(true);
  }, []);

  const handleError = useCallback(() => {
    setVideoReady(false);
  }, []);

  return {
    containerRef,
    videoRef,
    isMobile,
    shouldLoadVideo,
    videoReady,
    prefersReducedMotion,
    handlePlaying,
    handleError,
  };
}
