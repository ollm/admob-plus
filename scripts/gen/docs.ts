/// <reference types="cordova-plus" />
import assert from "node:assert/strict";
import path from "node:path";
import { PluginInfo } from "cordova-common";
import { replaceInFile } from "replace-in-file";
import type Context from "./context";
import CordovaGen from "./cordova";

export default class Generator {
  constructor(
    private ctx: Context,
    private cordovaGen = new CordovaGen(ctx),
  ) {}

  async files() {
    const cordovaPlugin = new PluginInfo(this.cordovaGen.pkgDir());
    const GMA_NEXT_GEN_VERSION = cordovaPlugin._et
      .find(
        './platform/[@name="android"]/preference/[@name="GMA_NEXT_GEN_VERSION"]',
      )
      ?.get("default");
    assert(GMA_NEXT_GEN_VERSION);

    await replaceInFile({
      files: path.join(
        this.ctx.rootDir,
        "website/docs/cordova/installation.mdx",
      ),
      from: /--GMA_NEXT_GEN_VERSION=([\d\.]+)/g,
      to: `--GMA_NEXT_GEN_VERSION=${GMA_NEXT_GEN_VERSION}`,
    });

    return {} as Record<string, string>;
  }
}
