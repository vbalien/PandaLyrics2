import { atom, useRecoilState } from 'recoil';

const MoveModeState = atom({
  key: 'MoveMode',
  default: false,
  effects: [
    ({ onSet, setSelf }) => {
      onSet(newVal => {
        window.pandaLyricsAPI.setMove(newVal);
      });

      const callback = (val: boolean) => {
        setSelf(val);
      };
      const unSub = window.pandaLyricsAPI.onSetMove(callback);
      return () => {
        unSub();
      };
    },
  ],
});

export function useMoveMode() {
  return useRecoilState(MoveModeState);
}
