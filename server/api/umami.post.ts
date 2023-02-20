import type { ServerPayload } from '../../internal/types';

// const endpoint = `${ROOT}/api/collect`;

export default defineEventHandler(async (event) => {
  const config = useAppConfig();
  const body: ServerPayload = await readBody(event);
  // const config = useRuntimeConfig();

  console.info(config);

  return 'success';
});
