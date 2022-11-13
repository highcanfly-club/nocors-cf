/*!
=========================================================
* © 2022 Ronan LE MEILLAT for SCTG Développement
=========================================================
This website use:
- Vuejs v3
- Font Awesome
- And many others
*/
//import got, { Headers, Method, OptionsOfTextResponseBody } from "got";
import packageVersion from "../package.json" assert { type: "json" };
import whitelistConf from "./common/config/whitelisteConf.json" assert { type: "json" };

export declare type Method =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "HEAD"
  | "DELETE"
  | "OPTIONS"
  | "TRACE"
  | "get"
  | "post"
  | "put"
  | "patch"
  | "head"
  | "delete"
  | "options"
  | "trace";

// WHITELIST is passed via env variable process.env.PROXY_WHITELIST
const WHITELIST_REGEX = new RegExp(whitelistConf.regex);

// you can use something like
// const WHITELIST_REGEX=/https:\/\/YOURSITE.com\/.*/
//

/**
 * Cosntruct a minimal set of CORS headers
 * @param origin CORS origin
 * @returns a set of required
 */

const getCorsHeaders = (origin: string, method: Method): Headers => {
  const headersInit: HeadersInit = {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Content-Encoding, Accept",
    "Access-Control-Allow-Methods": "OPTIONS, GET, POST, PATCH, PUT, DELETE",
    Via: `noCors-for-Cloudflare-Pages v${packageVersion.version}`,
    "x-original-method": method,
  };
  return new Headers(headersInit);
};

/**
 * Remove conflicting headers
 * @param headers
 * @returns a copy of the source headers
 */
const cleanRequestHeaders = (headers: Headers): Headers => {
  const requestHeaders: Headers = new Headers(headers); //real copy
  requestHeaders.has("X-Content-Type-Options")
    ? requestHeaders.delete("X-Content-Type-Options")
    : "";
  requestHeaders.has("host") ? requestHeaders.delete("host") : "";
  requestHeaders.has("connection") ? requestHeaders.delete("connection") : "";
  return requestHeaders;
};

/**
 * Proxy the request
 * @param url the url to proxy
 * @param method GET, POST…
 * @param requestHeaders
 * @param body
 * @returns
 */
const remoteRequest = async (
  url: string,
  method: Method,
  requestHeaders: Headers,
  body: any
) => {
  const options: RequestInit = {
    method: method,
    headers: requestHeaders,
    body: body,
    redirect: "follow",
  };
  const res = await fetch(url, options);
  return res;
};

/**
 * Check if the requested url is in the whitelist
 * @param url
 * @returns
 */
const isAllowed = (url: string): boolean => {
  return !(url.match(WHITELIST_REGEX) === null);
};

export const onRequest: PagesFunction = async (context) => {
  // Contents of context object
  const {
    request, // same as existing Worker API
    env, // same as existing Worker API
    params, // if filename includes [id] or [[path]]
    waitUntil, // same as ctx.waitUntil in existing Worker API
    next, // used for middleware or to fetch assets
    data, // arbitrary space for passing data between middlewares
  } = context;

  const method: Method =
    request.method != "CONNECT" ? (request.method as Method) : "GET";
  const corsHeaders = getCorsHeaders(request.headers.get("origin"), method);
  const sUrl = new URL(request.url);
  const url = sUrl.searchParams.get("url");
  const requestHeaders: Headers = cleanRequestHeaders(request.headers);

  if (!isAllowed(url)) {
    corsHeaders.append("Allow", "OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE");
    return new Response("Access to this proxy is forbidden for you ☹️", {
      status: 403,
      headers: corsHeaders,
    });
  } else if (method == "OPTIONS") {
    corsHeaders.append("Allow", "OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE");
    return new Response("", {
      status: 200,
      headers: corsHeaders,
    });
  }
    else // not options so general case
  {
    const res = await remoteRequest(url,method,requestHeaders,request.body)
    const buffer:ArrayBuffer = await res.arrayBuffer()
    corsHeaders.append("Allow", "OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE");
    let body:BodyInit
    return new Response(buffer, {
      status: res.status,
      headers: new Headers([...corsHeaders,...res.headers]),
    });
  }
};
