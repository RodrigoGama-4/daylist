import { auth } from '@/src/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { graphql } from '@/graphql/types';
import { Layout } from '@/graphql/types/graphql';
import { useQuery, useLazyQuery } from '@apollo/client';
import { useEffect, useRef, useState } from 'react';

const GET_LAYOUTS = graphql(`
  query UserLayouts($uid: ID!) {
    mural(uid: $uid) {
      layouts {
        i
        h
        w
        x
        y
        note
      }
    }
  }
`);

export default function useUserMural(onLoad?: (layouts: Layout[]) => void) {
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [user, userLoading, userErr] = useAuthState(auth);
  const [getLayouts, { data, loading, error }] = useLazyQuery(GET_LAYOUTS);
  const onLoadRef = useRef(onLoad);
  const onLoaded = onLoadRef.current;

  // 1 - esperar usuário carregar para pegar uid
  useEffect(() => {
    if (!user) return;
    getLayouts({ variables: { uid: user.uid } });
  }, [user, getLayouts]);

  // 2 - setar layout ao retorno da query
  useEffect(() => {
    if (!data) return;
    setLayouts(data.mural.layouts);
    onLoaded && onLoaded(data.mural.layouts);
  }, [data, onLoaded]);

  return [
    layouts,
    userLoading || loading || data === undefined,
    error || userErr,
  ] as const;
}
