import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AppLoading from 'vite-plugin-app-loading'
import { VantResolver } from '@vant/auto-import-resolver'
import { configCompressPlugin } from './compress'

export function getPluginsList(VITE_COMPRESSION) {
  return [
    vue(),
    AutoImport({
      imports: ['vue'],
      resolvers: [ElementPlusResolver(), IconsResolver(), VantResolver()]
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ['ep']
        }),
        VantResolver()
      ]
    }),
    Icons({
      autoInstall: true
    }),
    AppLoading('loading.html'),
    configCompressPlugin(VITE_COMPRESSION)
  ]
}
