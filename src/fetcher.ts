// thx fireship

/** @returns [data?, error?] */
export default async function fetcher<T>(
  promise: Promise<T>,
): Promise<[T | null, unknown | null]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    console.error(error);
    return [null, error];
  }
}
