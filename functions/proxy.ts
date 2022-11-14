/*!
=========================================================
* © 2022 Ronan LE MEILLAT for SCTG Développement
=========================================================
This website use:
- Vuejs v3
- Font Awesome
- And many others
*/

import whitelistConf from "./common/config/whitelisteConf.json" assert { type: "json" };
import {proxyPagesRequest} from "@sctg/nocors-pages"
export const onRequest: PagesFunction = async (context) => {
  return proxyPagesRequest(context,whitelistConf.regex)
};
