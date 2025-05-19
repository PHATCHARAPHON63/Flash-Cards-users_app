import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // รองรับ JSX ในไฟล์ .js (แต่แนะนำให้เปลี่ยนเป็น .jsx)
      include: '**/*.{jsx,js}',
      // เพิ่ม babel config
      babel: {
        plugins: [['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]]
      }
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `$node-modules: "${path.resolve(__dirname, 'node_modules').replace(/\\/g, '/')}";`
      }
    },
    postcss: {
      plugins: [
        {
          postcssPlugin: 'postcss-import-resolver',
          resolve(id, basedir) {
            // แก้ไขการ import ที่มี ~ (tilde)
            if (id.startsWith('~')) {
              return path.resolve('./node_modules', id.substring(1));
            }
            return id;
          }
        }
      ]
    }
  },
  resolve: {
    alias: {
      // ตั้งค่า base aliases
      '@': path.resolve(__dirname, './src'),
      '~': path.resolve(__dirname, './src'),

      // แก้ไขปัญหา bare imports ที่พบจากข้อผิดพลาด
      serviceWorker: path.resolve(__dirname, './src/serviceWorker'),
      App: path.resolve(__dirname, './src/App'),
      store: path.resolve(__dirname, './src/store'),

      // เพิ่ม aliases สำหรับโฟลเดอร์หลักทั้งหมดใน src
      component: path.resolve(__dirname, './src/component'),
      config: path.resolve(__dirname, './src/config'),
      constants: path.resolve(__dirname, './src/constants'),
      contexts: path.resolve(__dirname, './src/contexts'),
      hooks: path.resolve(__dirname, './src/hooks'),
      'menu-items': path.resolve(__dirname, './src/menu-items'),
      routes: path.resolve(__dirname, './src/routes'),
      views: path.resolve(__dirname, './src/views'),

      // เพิ่มเติม aliases สำหรับโฟลเดอร์ย่อยที่อาจมีการ import โดยตรง
      'component/function': path.resolve(__dirname, './src/component/function'),
      'menu-items/dashboard': path.resolve(__dirname, './src/menu-items/dashboard'),
      'views/pages': path.resolve(__dirname, './src/views/pages'),
      'views/pages/authentication': path.resolve(__dirname, './src/views/pages/authentication'),
      'views/pages/authentication/auth-forms': path.resolve(__dirname, './src/views/pages/authentication/auth-forms'),

      // เพิ่ม alias สำหรับ assets
      assets: path.resolve(__dirname, './src/assets'),
      'assets/scss': path.resolve(__dirname, './src/assets/scss'),
      'assets/images': path.resolve(__dirname, './src/assets/images'),

      // เพิ่ม alias สำหรับ themes และ layout
      themes: path.resolve(__dirname, './src/themes'),
      layout: path.resolve(__dirname, './src/layout'),

      // เพิ่ม alias สำหรับ ui-component และโครงสร้างย่อย
      'ui-component': path.resolve(__dirname, './src/ui-component'),
      'ui-component/cards': path.resolve(__dirname, './src/ui-component/cards'),
      'ui-component/cards/MainCard': path.resolve(__dirname, './src/ui-component/cards/MainCard'),
      'ui-component/cards/SubCard': path.resolve(__dirname, './src/ui-component/cards/SubCard'),
      'ui-component/Loadable': path.resolve(__dirname, './src/ui-component/Loadable'),
      'ui-component/Logo': path.resolve(__dirname, './src/ui-component/Logo'),
      'ui-component/extended': path.resolve(__dirname, './src/ui-component/extended'),
      'ui-component/extended/AnimateButton': path.resolve(__dirname, './src/ui-component/extended/AnimateButton'),
      'ui-component/extended/Breadcrumbs': path.resolve(__dirname, './src/ui-component/extended/Breadcrumbs'),
      'ui-component/extended/Transitions': path.resolve(__dirname, './src/ui-component/extended/Transitions'),

      // เพิ่ม alias สำหรับ services
      services: path.resolve(__dirname, './src/services'),
      'services/socket': path.resolve(__dirname, './src/services/socket'),

      // เพิ่ม alias สำหรับ store
      'store/actions': path.resolve(__dirname, './src/store/actions'),

      // แก้ไขปัญหา import จาก node_modules ใน CSS
      '~react-perfect-scrollbar': path.resolve(__dirname, 'node_modules/react-perfect-scrollbar'),
      '~node_modules': path.resolve(__dirname, 'node_modules')
    },
    extensions: ['.js', '.jsx', '.json']
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['flash-cards1-1c1b3715d187.herokuapp.com'],
    open: false,
    hmr: {
      overlay: true,
      clientPort: 443, // ให้ HMR websocket ใช้ port 443
      protocol: 'wss' // เพราะ devtunnel เป็น HTTPS → ใช้ wss แทน ws
    }
  },
  build: {
    outDir: 'build',
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  // จัดการ environment variables
  define: {
    // จำลอง process.env เพื่อให้สามารถใช้ process.env ได้เหมือนใน CRA
    'process.env': process.env
  },
  // ตั้งค่าเพิ่มเติมสำหรับการแก้ไขปัญหา
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis' // แก้ไขปัญหา global is not defined
      }
    }
  }
});
