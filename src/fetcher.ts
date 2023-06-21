// thx fireship

/** @returns [data?, error?] */
export default async function fetcher(promise: Promise<unknown>) {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    console.error(error);
    return [null, error];
  }
}
