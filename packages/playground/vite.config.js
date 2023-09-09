import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import Inspect from 'vite-plugin-inspect';
import collie from '@colliejs/vite';

const extensions = ['.tsx', '.ts', '.js', '.jsx', '.cjs'];
export default defineConfig({
  plugins: [
    collie({ extensions }),
    react(),
    Inspect(),
  ],
});
