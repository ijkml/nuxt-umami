import { createError, readValidatedBody, defineEventHandler, getHeaders } from 'h3';
import { getClientIp } from 'request-ip';
import { ofetch } from 'ofetch';
import { parseEventBody } from '../utils';
import { useRuntimeConfig } from '#imports';

export default defineEventHandler(async (event) => {
  // validate body
  const result = await readValidatedBody(
    event,
    body => parseEventBody(body),
  );

  // invalid data, throw error
  if (!result.success) {
    console.log('[nuxt-umami-endpoint]: invalid data', result.output);
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid data.',
    });
  }

  // grab config and host from runtimeConfig
  const { endpoint, website, domains } = useRuntimeConfig()._proxyUmConfig;

  // request headers
  const headers = getHeaders(event);
  const origin = headers.origin;
  const userAgent = headers['user-agent'];

  // TODO: option to limit access to only user domain, maybe use siteConfig

  if (!origin || (domains && !domains.includes(new URL(origin).hostname))) {
    // disabled by domains
    throw createError({
      statusCode: 403, // forbidden
      statusMessage: 'Invalid origin.',
    });
  }

  try {
    const { payload, cache, type } = result.output;
    const ip = getClientIp(event.node.req);

    return await ofetch<string>(endpoint, {
      method: 'POST',
      headers: {
        ...(cache && { 'x-umami-cache': cache }),
        ...(userAgent && { 'user-agent': userAgent }),
      },
      body: {
        type,
        payload: {
          website,
          ...payload,
          // don't send localhost ip (127.0.0.1)
          ...(!import.meta.dev && { ip }),
        },
      },
    });
  }
  catch (error) {
    let code = 502; // bad gateway
    let message = 'Unknown error.';

    if (error instanceof Error) {
      message = error.message;

      if ('data' in error && typeof error.data === 'string') {
        message = error.data;
        code = 400;
      }
    }

    throw createError({
      name: 'API Error',
      statusCode: code,
      data: message,
      message,
    });
  }
});
