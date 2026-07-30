const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');
const path = require('path');

module.exports = defineConfig({
  plugins: [react()],

  base: './',

  envDir: path.resolve(__dirname, '../'),

  build: {
    outDir: 'dist',
  },
});