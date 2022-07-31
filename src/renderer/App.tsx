import { Main, Settings } from './page';

export function App() {
  const hash = location.hash;
  return (
    <>
      {hash === '#main' && <Main />}
      {hash === '#settings' && <Settings />}
    </>
  );
}
