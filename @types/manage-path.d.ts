declare module "manage-path" {
  export interface PathObject {
    push: (...paths: string[]) => string;
    unshift: (...paths: string[]) => string;
    get: () => string;
    restore: () => string;
  }

  export default function managePath(env: object, options?: { paltform?: string }): PathObject;
}
