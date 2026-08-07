import path from "node:path";
import * as fse from "fs-extra";
import xmlFormat from "xml-formatter";
import xml2js from "xml2js";
import { Events } from "../../packages/cordova/src/www/common";
import {
  changes,
  getUnionTypeDict,
  renderKotlinConstants,
  warnMessage,
} from "./common";
import type Context from "./context";

async function androidLatestVersion() {
  const res = await fetch(
    "https://dl.google.com/dl/android/maven2/com/google/android/libraries/ads/mobile/sdk/ads-mobile-sdk/maven-metadata.xml",
  );
  const data = await res.text();
  const result: { metadata: { versioning: Array<{ latest: [string] }> } } =
    await xml2js.parseStringPromise(data);
  return result.metadata.versioning[0].latest[0];
}

class Generator {
  constructor(private ctx: Context) {}

  pkgDir(...args: string[]) {
    return this.ctx.rootDirJoin("packages/cordova", ...args);
  }

  get cordovaActions() {
    return getUnionTypeDict(this.pkgDir("src/www/common.ts"), "CordovaAction");
  }

  buildKotlin() {
    const linesActions = renderKotlinConstants(this.cordovaActions);
    const linesEvents = renderKotlinConstants(Events);

    return `// ${warnMessage}
package admob.plus.cordova

object Actions {
${linesActions}
}

object Events {
${linesEvents}
}
`;
  }

  buildProxyJs() {
    const linesActions = Object.entries(this.cordovaActions)
      .map(([k, v]) => `  ${k}() {},`)
      .sort()
      .join("\n");

    return `// ${warnMessage}
'use strict';

const AdMob = {
${linesActions}
};

// eslint-disable-next-line
require('cordova/exec/proxy').add('AdMob', AdMob);
`;
  }

  async updatePluginXML() {
    const filename = path.join(this.ctx.rootDir, "packages/cordova/plugin.xml");
    const pluginXML = await fse.readFile(filename, "utf8");

    const m = pluginXML.match(
      /(GMA_NEXT_GEN_VERSION" default=")([\d.]+)("[\s\S]*<config-file target="\*-Info.plist" parent="SKAdNetworkItems">\s)([\s\S]+?)(\s+<\/config-file>)/,
    );
    if (!m) throw new Error("Can not parse plugin.xml");
    const [m0, m1, _androidVersion, m3, _items, m5] = m;
    const latestItems = xmlFormat(this.ctx.adNetworkItems, {
      collapseContent: true,
      lineSeparator: "\n",
    }).replace(/^/gm, "            ");

    const s = [m1, await androidLatestVersion(), m3, latestItems, m5].join("");

    return {
      filename,
      before: pluginXML,
      after: pluginXML.replace(m0, s),
    };
  }

  async files() {
    return {
      ...changes(await this.updatePluginXML()),
      [this.pkgDir("src/android/cordova/Generated.kt")]: this.buildKotlin(),
      [this.pkgDir("src/browser/AdMobProxy.js")]: this.buildProxyJs(),
    };
  }
}

export default Generator;
