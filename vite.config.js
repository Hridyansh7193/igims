import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Strips GateScannerPage and html5-qrcode out of Vercel website builds completely,
 * while keeping them bundled for local/GitHub Actions Android Capacitor APK builds.
 */
function stripScannerOnWebPlugin() {
  const isWebDeployBuild = process.env.VERCEL === '1' || process.env.WEB_ONLY === '1';
  const stubPath = path.resolve(__dirname, 'src/lib/webNoScannerStub.js');

  return {
    name: 'strip-gate-scanner-on-web',
    enforce: 'pre',
    resolveId(source, importer) {
      if (!isWebDeployBuild) return null;
      if (
        source === './pages/GateScannerPage' ||
        source.endsWith('/GateScannerPage') ||
        source.endsWith('/GateScannerPage.jsx')
      ) {
        return stubPath;
      }
      if (importer && importer.includes('GateScannerPage') && source.includes('html5-qrcode')) {
        return stubPath;
      }
      return null;
    },
  };
}

export default defineConfig({
  plugins: [stripScannerOnWebPlugin(), react()],
  envPrefix: ['VITE_', 'SUPABASE_', 'RAZORPAY_'],
});
