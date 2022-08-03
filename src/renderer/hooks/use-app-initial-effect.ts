import { useEffect } from 'react';
import { useSettings } from '../store/settings';

export default function useAppInitialEffect() {
  const [settings, setSettings] = useSettings();
  useEffect(() => {
    window.pandaLyricsAPI.setVisible(settings.appVisible);
    window.pandaLyricsAPI.setWindowPos(settings.windowLeft, settings.windowTop);
    const callback = (val: boolean) => {
      setSettings('appVisible', val);
    };
    const unSub = window.pandaLyricsAPI.onSetVisible(callback);
    return () => {
      unSub();
    };
  }, [setSettings, settings]);
}
