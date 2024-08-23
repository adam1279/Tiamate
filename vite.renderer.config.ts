import type { ConfigEnv, UserConfig } from 'vite';
import { defineConfig } from 'vite';
import { pluginExposeRenderer } from './vite.base.config';
import VuePlugin from "@vitejs/plugin-vue";

// https://vitejs.dev/config
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<'renderer'>;
  const { root, mode, forgeConfigSelf } = forgeEnv;
  const name = forgeConfigSelf.name ?? '';

  return {
    root,
    mode,
    base: './',
    build: {
      outDir: `.vite/renderer/${name}`,
    },
    plugins: [pluginExposeRenderer(name), VuePlugin()],
    resolve: {
      preserveSymlinks: true,
    },
    clearScreen: false,
    // define: {
    //   // __INTLIFY_JIT_COMPILATION__: true,
    //   // __INTLIFY_DROP_MESSAGE_COMPILER__: true
    // }
  } as UserConfig;
});
