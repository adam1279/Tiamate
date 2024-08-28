import type { ConfigEnv, UserConfig } from 'vite';
import { defineConfig } from 'vite';
import { pluginExposeRenderer } from './vite.base.config';
import VuePlugin from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<'renderer'>;
  const { root, mode, forgeConfigSelf } = forgeEnv;
  const name = forgeConfigSelf.name ?? '';

  return {
    root: path.join(__dirname, "src", name),
    mode,
    base: './',
    build: {
      outDir: `.vite/renderer/${name}`,
      assetsDir: "static/assets"
    },
    plugins: [pluginExposeRenderer(name), VuePlugin()],
    resolve: {
      preserveSymlinks: true,
      alias: {
        '@assets': path.resolve(__dirname, './assets')
      }
    },
    clearScreen: false,
    // define: {
    //   // __INTLIFY_JIT_COMPILATION__: true,
    //   // __INTLIFY_DROP_MESSAGE_COMPILER__: true
    // }
  } as UserConfig;
});
