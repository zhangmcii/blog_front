import { fileURLToPath, URL } from 'node:url'
import { include, exclude } from "./build/optimize";
import { loadEnv } from "vite";
import { getPluginsList } from './build/plugins'
import { root, wrapperEnv } from './build/utils'

export default ({ mode }) => {
  const { VITE_COMPRESSION } = wrapperEnv(
    loadEnv(mode, root)
  )
  
  return {
    plugins: getPluginsList(VITE_COMPRESSION),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: '0.0.0.0',
      port: 5456
    },
    define: {
      // enable hydration mismatch details in production build
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
    },
    optimizeDeps: {
        include,
        exclude
    },
    build: {
      rollupOptions: {
        // 静态资源分类打包
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
    }
  }
}