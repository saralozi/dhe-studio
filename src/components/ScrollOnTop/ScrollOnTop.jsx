import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const htmlElement = document.documentElement;
    const previousScrollBehavior =
      htmlElement.style.scrollBehavior;

    // Prevent global smooth-scroll CSS from interfering
    htmlElement.style.scrollBehavior = 'auto';

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    });

    const animationFrame = requestAnimationFrame(() => {
      htmlElement.style.scrollBehavior =
        previousScrollBehavior;
    });

    return () => {
      cancelAnimationFrame(animationFrame);

      htmlElement.style.scrollBehavior =
        previousScrollBehavior;
    };
  }, [pathname]);

  return null;
};

export default ScrollToTop;