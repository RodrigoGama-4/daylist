import { auth } from '@/src/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { graphql } from '@/graphql/types';
import { useQuery, useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Layout } from 'react-grid-layout';
import { apolloClient } from '@/app/layout';

const GET_LAYOUTS = graphql(`
  query UserLayouts($uid: ID!) {
    mural(uid: $uid) {
      layouts {
        i
        h
        w
        x
        y
      }
    }
  }
`);

export default function useUserMural(onLoad?: (layouts: Layout[]) => void) {
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [user, userLoading, userErr] = useAuthState(auth);
  const [getLayouts, { data, loading, error }] = useLazyQuery(GET_LAYOUTS);

  // 1 - esperar usuário carregar para pegar uid
  useEffect(() => {
    if (!user) return;
    getLayouts({ variables: { uid: user.uid } });
  }, [user, getLayouts]);

  // 2 - setar layout ao retorno da query
  useEffect(() => {
    if (!data) return;
    setLayouts(data.mural.layouts);
    onLoad && onLoad(data.mural.layouts);
  }, [data]);

  return [
    layouts,
    userLoading || loading || data === undefined,
    error || userErr,
  ] as const;
}

// fiz pra usar com o use() hook mas acho que n vou usar
export function getUserMural() {
  return new Promise<Layout[] | null>((resolve, reject) => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) return resolve(null);
      const { data, loading, error } = await apolloClient.query({
        query: GET_LAYOUTS,
        variables: {
          uid: user.uid,
        },
      });
      if (error) return reject(error);
      resolve(data.mural.layouts);
    });
    unsub();
  });
}
