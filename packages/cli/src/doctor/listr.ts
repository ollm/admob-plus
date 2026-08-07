import type { ListrBaseClassOptions } from "listr2";
import type { Pkg } from "pkg-proxy";

export interface Ctx {
  pkg?: Pkg;
  swiftVersion: string;
  gmaNextGenVersion: string;
  iosSDKVersion: string;
}

export const options: ListrBaseClassOptions<Ctx, "default", "simple"> = {
  concurrent: true,
  exitOnError: false,
};
