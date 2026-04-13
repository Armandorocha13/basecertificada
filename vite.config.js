import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        selecao: resolve(__dirname, 'src/pages/selecao.html'),
        formulario: resolve(__dirname, 'src/pages/formulario.html'),
        fisico: resolve(__dirname, 'src/pages/fisico.html'),
        perdido: resolve(__dirname, 'src/pages/perdido.html'),
      },
    },
  },
});
