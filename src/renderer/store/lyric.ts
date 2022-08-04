import { LyricDetailData } from '../../main/alsong';
import { atom, selector, useRecoilValue } from 'recoil';
import { ThreeViewState } from './settings';

const LyricTimeState = atom<number>({
  key: 'LyricTimeState',
  default: 0,
  effects: [
    ({ setSelf }) => {
      const unSub = window.pandaLyricsAPI.addTickListener(data => {
        setSelf(data);
      });

      return () => {
        unSub();
      };
    },
  ],
});

const LyricState = atom<LyricDetailData | null>({
  key: 'LyricState',
  default: null,
  effects: [
    ({ setSelf }) => {
      const unSub = window.pandaLyricsAPI.addLyricChangeListener(data => {
        setSelf(data);
      });

      return () => {
        unSub();
      };
    },
  ],
});

export type LyricEntities = {
  id: number;
  content: string;
  time: number;
  current?: boolean;
}[];
const LyricEntitiesState = selector({
  key: 'LyricEntitiesState',
  get: ({ get }) => {
    const lyricEntities: LyricEntities = [];
    const lyricInfo = get(LyricState);
    const rx = /(?:\[(?<min>\d\d):(?<sec>\d\d\.\d\d)\])(?<content>.*)/gi;
    if (!lyricInfo) {
      return [];
    }
    const match = lyricInfo.lyric.matchAll(rx);

    let prevTime = 0;
    let id = 0;
    for (const { groups } of match) {
      if (!groups) continue;
      const min = Number.parseInt(groups.min);
      const sec = Number.parseFloat(groups.sec);
      const msec = (min * 60 + sec) * 1000;
      const content = groups.content;

      if (lyricEntities.length > 0 && msec === prevTime) {
        const last = lyricEntities.at(-1);
        if (last) {
          last.content += '\n' + content;
        }
        continue;
      }
      lyricEntities.push({
        id: id++,
        content,
        time: msec,
      });
      prevTime = msec;
    }
    return lyricEntities.reverse();
  },
});

const DisplayLyricEntities = selector<LyricEntities>({
  key: 'DisplayLyricList',
  get: ({ get }) => {
    const threeView = get(ThreeViewState);
    const entities = get(LyricEntitiesState);
    const time = get(LyricTimeState);

    for (let i = 0; i < entities.length; ++i) {
      const entity = entities[i];
      if (entity.time == 0) {
        continue;
      }
      if (entity.time <= time) {
        if (threeView) {
          return [
            entities.at(i - 1),
            { ...entities.at(i), current: true },
            entities.at(i + 1),
          ].filter(i => i !== undefined) as LyricEntities;
        } else {
          return [{ ...entities.at(i), current: true }] as LyricEntities;
        }
      }
      entity.time;
    }
    return [];
  },
});

export function useLyric() {
  return useRecoilValue(LyricState);
}

export function useDisplayLyricEntities() {
  return useRecoilValue(DisplayLyricEntities);
}
