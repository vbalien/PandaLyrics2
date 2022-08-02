import { useEffect, useRef } from 'react';

export default function useDetectSettingsOpen() {
  const win = useRef<Window | null>(null);

  useEffect(() => {
    const callback = () => {
      if (win.current !== null && !win.current.closed) {
        return;
      }
      const url = new URL(window.location.href);
      url.hash = '#settings';
      win.current = window.open(
        url.href,
        '_blank',
        `width=400,height=600,resizable=false,maximizable=false,minimizable=false`
      ) as Window;
      win.current.document.title = 'Settings';
    };
    const unSub = window.pandaLyricsAPI.onSettingsOpen(callback);
    return () => {
      unSub();
    };
  }, []);
}
