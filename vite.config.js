// frontend/vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        cadastro: resolve(__dirname, 'cadastro.html'),
        obrigado: resolve(__dirname, 'obrigado.html'),
        respostas: resolve(__dirname, 'respostas.html')
        // Adicione outras páginas HTML aqui
      }
    }
  },
  // Garanta que o 'root' esteja correto se seus HTMLs não estão na raiz do projeto Vite
  // Por exemplo, se seus HTMLs estão em `frontend/` e o vite.config.js também:
  root: __dirname, // ou simplesmente não defina 'root' se essa é a estrutura padrão
})