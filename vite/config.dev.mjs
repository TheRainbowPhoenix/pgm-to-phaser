import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
    base: "./",
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ['phaser']
                }
            }
        },
    },
    publicDir: true,
	resolve: {
		alias: {
			'~': true,
			'$service-worker': true
		}
	},
    server: {
        port: 8080
    },
    define: {
        '__DEBUG__': mode === 'development'
    }
}));
