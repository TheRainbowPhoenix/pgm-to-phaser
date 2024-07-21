declare namespace Phaser.Loader {
    interface LoaderPlugin extends Phaser.Events.EventEmitter {
        webfont(key: string, fontName: string): LoaderPlugin;
    }
}