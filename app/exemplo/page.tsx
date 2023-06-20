'use client';
import usePushQuery from '@/src/hooks/usePushQuery';
import _ from 'lodash';

export default function Page() {
  const { pushQuery } = usePushQuery();
  return (
    <main className="flex flex-col p-10">
      <button
        className="btn btn-primary"
        onClick={() => {
          const route = pushQuery({
            add: { nav: '2', muitos: ['32', '33', '42'] },
            rem: {
              nav: '5', // pode usar string ou string[]
              muitos: '*', // isso aqui deleta tudo o que não tiver em toAdd
            },
          });
          alert(route);
        }}
      >
        Apertar
      </button>
    </main>
  );
}
