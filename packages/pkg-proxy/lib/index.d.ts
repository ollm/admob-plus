import { PackageJson as PackageJsonBase } from 'types-package-json';
export type PackageJsonFileName = 'package.json';
export interface PackageJson extends PackageJsonBase {
    [k: string]: any;
}
export declare const fileName: PackageJsonFileName;
type Options = {
    cwd?: string;
    filename?: string;
    searchParents?: boolean;
};
export type PkgProxy = PackageJson & Pkg;
export declare class Pkg {
    static createProxy(opts?: Options): Promise<PkgProxy | undefined>;
    static find(opts?: Options): Promise<Pkg | undefined>;
    static read(filename: string): Promise<Pkg>;
    readonly filename: string;
    readonly json: PackageJson;
    constructor(filename: string, pkg: PackageJson);
    get dependencies(): Record<string, string>;
    get devDependencies(): Record<string, string>;
    depends(name: string): boolean;
    dependsAny(...names: string[]): boolean;
    rootDir(...paths: string[]): string;
}
export declare const findPkg: typeof Pkg.createProxy;
export default findPkg;
