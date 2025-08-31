import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],

    define: {
      // Tối ưu cho production
      __DEV__: mode === 'development',
      // Tối ưu Ant Design
      'process.env.NODE_ENV': JSON.stringify(mode),
      // Đảm bảo tương thích
      global: 'globalThis',
      // Tránh xung đột
      'process.env': '{}',
    },
    // Loại bỏ các module Node.js không tương thích
    ssr: {
      noExternal: ['antd', '@ant-design/icons']
    },
    build: {
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
          passes: 3,
          toplevel: true,
          unsafe: true,
          unsafe_comps: true
        },
        mangle: {
          safari10: true,
          toplevel: true
        },
        format: {
          comments: false
        }
      },
      rollupOptions: {
        // Cải thiện external handling
        external: mode === 'production' ? ['ews-javascript-api'] : [],
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'antd-vendor': ['antd', '@ant-design/icons'],
            'utils-vendor': ['axios', 'date-fns', 'moment'],
            'form-vendor': ['react-hook-form', '@hookform/resolvers', 'yup'],
            'router-vendor': ['react-router-dom'],
            'ui-vendor': ['react-window', 'react-window-infinite-loader', 'react-icons'],
            'document-vendor': ['docx', 'xlsx']
          },
          // Tối ưu chunk naming
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
            return `js/[name]-[hash].js`;
          },
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            if (/\.(css)$/.test(assetInfo.name)) {
              return `css/[name]-[hash].${ext}`;
            }
            if (/\.(png|jpe?g|gif|svg|ico|webp)$/.test(assetInfo.name)) {
              return `images/[name]-[hash].${ext}`;
            }
            return `assets/[name]-[hash].${ext}`;
          }
        }
      },
      // Cấu hình phân chia chunks
      chunkSizeWarningLimit: 1000, // Tăng limit
      // Tối ưu hóa assets
      assetsInlineLimit: 4096,
      // Xóa console trong production
      target: 'es2020',
      // Tối ưu CSS
      cssCodeSplit: true,
      // Thêm report
      reportCompressedSize: false // Tắt để tăng tốc build
    },
    // Cấu hình server
    server: {
      port: 3000,
      strictPort: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
          // Thêm timeout
          timeout: 30000
        }
      }
    },
    // Cấu hình resolve
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@services': path.resolve(__dirname, './src/services')
      }
    },
    // Cấu hình CSS
    css: {
      devSourcemap: false,
      modules: {
        localsConvention: 'camelCase'
      }
    },
    // Tối ưu preflight
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'antd',
        '@ant-design/icons',
        'axios',
        'react-router-dom'
      ],
      exclude: ['ews-javascript-api']
    }
  }
})