import { auth } from '@/src/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { graphql } from '@/graphql/types';
import { useQuery, useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Layout } from 'react-grid-layout';

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

export default function useUserMural(onLoad: (layouts: Layout[]) => void) {
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
    onLoad(data.mural.layouts);
  }, [data]);

  // return error ? null : loading || data === undefined ? undefined : layouts;
  return new Promise<Layout[]>((resolve, reject) => {
    if (userLoading || loading || data === undefined) return;
    if (userErr) return reject(userErr);
    if (error) return reject(error);
    resolve(layouts);
  });
}
