import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'
import type {UserConfig, ConfigEnv, ProxyOptions} from 'vite'
import {isProd, loadEnv} from '/@/utils/vite'
import {svgBuilder} from '/@/components/icon/svg/index'

const pathResolve = (dir: string): any => {
    return resolve(__dirname, '.', dir)
}
const viteConfig = ({mode}: ConfigEnv): UserConfig => {
    const {VITE_PORT, VITE_OPEN, VITE_BASE_PATH, VITE_OUT_DIR, VITE_AXIOS_SLICING_URL} = loadEnv(mode)
    const alias: Record<string, string> = {
        '/@': pathResolve('./src/'),
        assets: pathResolve('./src/assets'),
        'vue-i18n': isProd(mode) ? 'vue-i18n/dist/vue-i18n.cjs.prod.js' : 'vue-i18n/dist/vue-i18n.cjs.js',
    }
    let proxy: Record<string, string | ProxyOptions> = {}

    proxy = {
        "/oss": {
            target: VITE_AXIOS_SLICING_URL, //后台服务器地址
            changeOrigin: true, //target为域名时必须设置此项
            secure: false, //设置支持 https 协议的代理
            rewrite: (path) => path.replace(/^\/oss/, ""),
        },
        // "/common": {
        //     target: 'http://apis.new.version.lo/common', //后台服务器地址
        //     changeOrigin: true, //target为域名时必须设置此项
        //     secure: false, //设置支持 https 协议的代理
        //     rewrite: (path) => path.replace(/^\/common/, ""),
        // },
    }

    return {
        plugins: [vue(), svgBuilder('./src/assets/images/icons/')],
        root: process.cwd(),
        resolve: {alias},
        base: VITE_BASE_PATH,
        server: {
            host: '0.0.0.0',
            port: VITE_PORT,
            open: VITE_OPEN,
            proxy: proxy,
        },
        build: {
            sourcemap: false,
            outDir: VITE_OUT_DIR,
            emptyOutDir: true,
            chunkSizeWarningLimit: 1500,
        },
        css: {
            postcss: {
                plugins: [
                    {
                        postcssPlugin: 'internal:charset-removal',
                        AtRule: {
                            charset: (atRule) => {
                                if (atRule.name === 'charset') {
                                    atRule.remove()
                                }
                            },
                        },
                    },
                ],
            },
        },
    }

}
export default viteConfig
