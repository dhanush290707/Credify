import { useEffect } from 'react';

/**
 * Custom hook to handle ESC key press
 * @param onEscape - Callback function to execute when ESC is pressed
 */
export function useEscapeKey(onEscape) {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onEscape();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onEscape]);
}