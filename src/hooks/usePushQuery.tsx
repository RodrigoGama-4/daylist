import _ from 'lodash';
import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from 'next/navigation';

export default function usePushQuery() {
  const router = useRouter();
  const query = useSearchParams();
  function pushQuery({
    toAdd,
    toRemove,
  }: {
    toAdd: Record<string, string[] | string>;
    toRemove: Record<string, string[] | string | '*'>;
  }) {
    const newQuery = new URLSearchParams(query.toString());
    const keySet = new Set([
      ...Array.from(new Set(query.keys())),
      ...Array.from(new Set(_.keys(toAdd))),
    ]);
    keySet.forEach((key) => {
      const values = query.getAll(key);
      let addValues: string[] = [];
      if (key in toAdd)
        addValues =
          typeof toAdd[key] === 'object'
            ? (toAdd[key] as string[])
            : [toAdd[key] as string];
      const addSet = new Set(addValues);
      let valueSet = new Set(values);

      if (_.has(toRemove, key)) {
        let rm = toRemove[key];
        if (rm === '*') valueSet.clear();
        else {
          if (typeof rm === 'string') rm = [rm];
          rm.forEach((v) => valueSet.delete(v));
        }
      }
      valueSet = new Set([...Array.from(valueSet), ...Array.from(addSet)]);

      newQuery.delete(key);
      valueSet.forEach((q) => {
        newQuery.append(key, q);
      });
    });
    const route = `${window.location.pathname}?${newQuery.toString()}`;
    router.push(route);
    return route;
  }
  return { pushQuery };
}

export function getQueryString(query: ReadonlyURLSearchParams) {
  const url = new URLSearchParams();
  query.forEach((value, key) => {
    url.append(key, value);
  });
  return url.toString();
}
