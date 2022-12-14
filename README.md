# Simplest noCors proxy for Cloudflare Pages

This is a very minimalistic proxy for enabling CORS on non CORS enabled sites.  
It uses https://github.com/highcanfly-club/nocors @sctg/nocors-pages ES2019 module
```sh
npm i --save @sctg/nocors-pages
```
create /functions/proxy.ts like
```js
const WHITELIST_REGEX="https://YOURSITE.com/.*""
import {proxyPagesRequest} from "@sctg/nocors-pages"
export const onRequest: PagesFunction = async (context) => {
  return proxyPagesRequest(context,WHITELIST_REGEX)
};
```
or carrefully open to anything 
```js
const WHITELIST_REGEX=".*"
```
Just prefix your fetch() calls with https://YOURSITE/proxy?url=  .  
  
Personnaly I define the whitelist as an environment variable in GitHub secrets, next /prepare-env.ts is ran at build time for generating an /functions/common/config/whitelistConf.json  
see [prepare-env.ts](https://github.com/highcanfly-club/nocors-cf/blob/main/prepare-env.ts#L3)

## Demo deployement
https://nocors.pages.dev/proxy?url=https://www.example.org   


## Vue 3 + Vite + Typescript + Tailwindcss + Cloudflare Pages

This template should help get you started developing with Vue 3 in Vite. The template uses [Vue 3](https://vuejs.org/), [Vite](https://vitejs.dev/), [Tailwind css](https://tailwindcss.com/) .

## Vite

- @ path is defined as ./src
- ~ path is defined as ./node_modules
- npm run dev : launch development environment and serve it to https://localhost:5173
- npm run build : compile, optimize and minify to dist/ directory
- npm run preview : serve dist/ directory to https://localhost:4173

## Howto

- Simply copy this repo with "Use this template" or fork it
- Clone your new repo
- issue "npm i" in your local clone 
- "npm run create-cert"
- issue "npm run dev"
- browser https://localhost:8788

## Tailwind css

- Tailwind is embedded with my default theme in tailwindcss.config.cjs
- All classes are availables in development environment (usefull for UI debug with devtools)
- Built css is parsed by Purgecss for removing all unused classes, take a look to postcss.config.cjs 

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## License

- [MIT](https://github.com/eltorio/vue-vite-tailwindcss-fontawesome/blob/main/LICENSE.md) for my work
- others are under their own license
