// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(),  tailwindcss(),],
//   "compilerOptions": {
//     "forceConsistentCasingInFileNames": true
//   }
  
// })
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://hireonboard-env.eba-5dbu6mza.us-east-1.elasticbeanstalk.com',
//         changeOrigin: true,
//         secure: false
//       }
//     }
//   }
// })



import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://hireonboard-env.eba-5dbu6mza.us-east-1.elasticbeanstalk.com',
//         changeOrigin: true,
//         secure: false
//       }
//     }
//   }
// })

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',  // ← your local backend port
        changeOrigin: true,
        secure: false
      }
    }
  }
})



// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://192.168.0.128:5000', // your backend
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
//   resolve: {
//     alias: {
//       '@': '/src',
//     },
//   },
// })
