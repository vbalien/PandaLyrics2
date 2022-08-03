import { useEffect, useRef } from 'react';

export default function useOpenSettingsEffect() {
  const win = useRef<Window | null>(null);

  useEffect(() => {
    const callback = () => {
      if (win.current !== null && !win.current.closed) {
        return;
      }
      const url = new URL(window.location.href);
      url.hash = '#settings';
      win.current = window.open(url.href, '_blank') as Window;
    };
    const unSub = window.pandaLyricsAPI.onSettingsOpen(callback);
    return () => {
      unSub();
    };
  }, []);
}
