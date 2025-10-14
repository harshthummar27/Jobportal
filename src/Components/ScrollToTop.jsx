import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use requestAnimationFrame for better performance and to prevent flash
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      
      // Also scroll any scrollable containers to top
      const scrollableElements = document.querySelectorAll('[data-scroll-container]');
      scrollableElements.forEach(element => {
        element.scrollTop = 0;
      });
    });
  }, [pathname]);

  // Disable browser's automatic scroll restoration
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  return null;
};

export default ScrollToTop;
