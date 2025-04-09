// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Get the repository name from the environment variable (if running in GitHub Actions)
const repoName = process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split('/')[1] : '';
const base = process.env.GITHUB_ACTIONS ? `/${repoName}/` : '/';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: base, // Set the base path dynamically or statically
  // Example static base path (replace 'react-weather-app-ts' with your repo name):
  // base: '/react-weather-app-ts/',
})