import { defineConfig } from 'vite';

export default defineConfig({
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
    }
});
