/**
 *
 * @param path 相对于/src/assets/的路径,直接拼接在'/src/assets/'之后
 * @returns 一个指向该素材的url
 */
export default function getAssetsUrl(path: string) {
    return new URL(`/src/assets/${path}`, import.meta.url).href;
}
