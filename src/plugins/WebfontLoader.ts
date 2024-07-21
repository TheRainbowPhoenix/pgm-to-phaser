import * as Phaser from 'phaser';
import WebFont from "webfontloader";

export class FontFile extends Phaser.Loader.File {

    private _config?: WebFont.Config;

    constructor(loader: Phaser.Loader.LoaderPlugin, key: string, config?: WebFont.Config) {
        super(loader, {
            type: "webfont",
            key: key
        });

        this._config = config;
    }

    load(): void {

        const config: WebFont.Config = {};

        if (this._config) {

            Object.assign(config, this._config);

        } else {

            config.custom = {
                families: [this.key]
            };
        }

        config.active = () => this.loader.nextFile(this, true);
        config.inactive = () => this.loader.nextFile(this, false);

        WebFont.load(config);
    }

}

class WebfontLoader extends Phaser.Loader.LoaderPlugin {
    loading = [];
    constructor(scene: Phaser.Scene) {
        super(scene);

        this.loading = [];
    }

    webfont(key: string, fontName: string, overwrite: boolean = false): this {
        // Here fontName will be stored in file's `url` property
        // after being added to the file list
        let fontFile = new FontFile(this, key, {
			custom: {
				families: [fontName]
			}
		});

        this.addFile(fontFile);
        return this;
    }

    // loadFile(file: any): void {

        // // We need to call asyncComplete once the file has loaded
        // if (file.type === 'webfont') {
        //     const font = new FontFaceObserver(file.url);
        //     font.load(null, 10000).then(() => {
        //         this.asyncComplete(file);
        //     }).catch(() => {
        //         this.asyncComplete(file, 'Error loading font ' + file.url);
        //     });
        // }
    // }
}

Phaser.Loader.LoaderPlugin.prototype.webfont = function (key: string, fontName: string) {
	this.addFile(new FontFile(this, key, {
        custom: {
            families: [fontName]
        }
    }));
    return this;
};


export default WebfontLoader;