import { defineConfig } from 'vite';

const phasermsg = () => {
    return {
        name: 'phasermsg',
        buildStart() {
            console.log(`Building for production...\n`);
        },
        buildEnd() {
            console.log("Done !")
        }
    }
}   

export default defineConfig({
    base: './',
    logLevel: 'warning',
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ['phaser']
                }
            }
        }
    },
    server: {
        port: 8080
    },
    plugins: [
        phasermsg()
    ]
});
