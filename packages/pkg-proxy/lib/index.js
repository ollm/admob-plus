import { findUp } from 'find-up';
import fse from 'fs-extra';
import * as path from 'path';
export const fileName = 'package.json';
async function findPackageJson(opts) {
    const cwd = opts?.cwd ?? process.cwd();
    const filename = opts?.filename ?? path.join(cwd, fileName);
    if (await fse.pathExists(filename)) {
        return filename;
    }
    if (opts?.searchParents) {
        const result = await findUp(fileName, { cwd });
        return result;
    }
}
export class Pkg {
    static async createProxy(opts) {
        const pkg = await this.find(opts);
        if (!pkg)
            return undefined;
        return new Proxy(pkg.json, {
            get(target, prop, receiver) {
                if (prop in pkg) {
                    return Reflect.get(pkg, prop, receiver);
                }
                return Reflect.get(target, prop, receiver);
            },
        });
    }
    static async find(opts) {
        const filename = await findPackageJson(opts);
        if (filename)
            return this.read(filename);
    }
    static async read(filename) {
        const pkg = await fse.readJson(filename);
        return new Pkg(filename, pkg);
    }
    filename;
    json;
    constructor(filename, pkg) {
        this.filename = filename;
        this.json = pkg;
    }
    get dependencies() {
        return this.json.dependencies ?? {};
    }
    get devDependencies() {
        return this.json.devDependencies ?? {};
    }
    depends(name) {
        return Boolean(this.dependencies[name] || this.devDependencies[name]);
    }
    dependsAny(...names) {
        return names.some(x => this.depends(x));
    }
    rootDir(...paths) {
        return path.join(path.dirname(this.filename), ...paths);
    }
}
export const findPkg = Pkg.createProxy.bind(Pkg);
export default findPkg;
