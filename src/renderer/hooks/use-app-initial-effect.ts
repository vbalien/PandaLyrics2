import { useEffect } from 'react';
import { useSettings } from '../store/settings';

export default function useAppInitialEffect() {
  const [settings, setSettings] = useSettings();
  useEffect(() => {
    window.pandaLyricsAPI.setVisible(settings.appVisible);
    window.pandaLyricsAPI.setWindowPos(settings.windowLeft, settings.windowTop);
    const unSub = window.pandaLyricsAPI.onSetVisible((val: boolean) => {
      setSettings('appVisible', val);
    });
    return () => {
      unSub();
    };
  }, [setSettings, settings]);
}
