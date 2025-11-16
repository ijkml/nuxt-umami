import { useRuntimeConfig } from "#imports";
import { createError, defineEventHandler, getHeaders, readValidatedBody } from "h3";
import { ofetch } from "ofetch";
import { getClientIp } from "request-ip";
import { parseEventBody } from "../utils.js";
export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(
    event,
    (body) => parseEventBody(body)
  );
  if (!result.success) {
    console.log("[nuxt-umami-endpoint]: invalid data", result.output);
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid data."
    });
  }
  const { endpoint, website, domains } = useRuntimeConfig()._proxyUmConfig;
  const headers = getHeaders(event);
  const origin = headers.origin;
  const userAgent = headers["user-agent"];
  if (!origin || domains && !domains.includes(new URL(origin).hostname)) {
    throw createError({
      statusCode: 403,
      // forbidden
      statusMessage: "Invalid origin."
    });
  }
  try {
    const { payload, cache, type } = result.output;
    const ip = getClientIp(event.node.req);
    return await ofetch(endpoint, {
      method: "POST",
      headers: {
        ...cache && { "x-umami-cache": cache },
        ...userAgent && { "user-agent": userAgent }
      },
      body: {
        type,
        payload: {
          website,
          ...payload,
          // don't send localhost ip (127.0.0.1)
          ...!import.meta.dev && { ip }
        }
      },
      credentials: "omit"
    });
  } catch (error) {
    let code = 502;
    let message = "Unknown error.";
    if (error instanceof Error) {
      message = error.message;
      if ("data" in error && typeof error.data === "string") {
        message = error.data;
        code = 400;
      }
    }
    throw createError({
      name: "API Error",
      statusCode: code,
      data: message,
      message
    });
  }
});
