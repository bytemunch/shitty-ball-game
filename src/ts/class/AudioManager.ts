export class AudioManager {
    actx: AudioContext;
    buffers: { [bufferID: string]: AudioBuffer };

    constructor() {
        this.actx = new AudioContext;

        this.actx.resume();

        this.buffers = {};
    }

    async init() {
        this.buffers['noise'] = new AudioBuffer({
            length: this.actx.sampleRate / 2,
            sampleRate: this.actx.sampleRate
        })

        // This gives us the actual array that contains the data
        var nowBuffering = this.buffers['noise'].getChannelData(0);
        for (var i = 0; i < this.buffers['noise'].length; i++) {
            // Math.random() is in [0; 1.0]
            // audio needs to be in [-1.0; 1.0]
            nowBuffering[i] = Math.random() * 2 - 1;
        }

        //TODO pull these dynamically?

        this.buffers['fire'] = await this.actx.decodeAudioData(await (await fetch('sounds/shoot.wav')).arrayBuffer());
        this.buffers['bounce'] = await this.actx.decodeAudioData(await (await fetch('sounds/bounce.wav')).arrayBuffer());
        this.buffers['explosion'] = await this.actx.decodeAudioData(await (await fetch('sounds/explosion.wav')).arrayBuffer());
        this.buffers['explosion2'] = await this.actx.decodeAudioData(await (await fetch('sounds/explosion2.wav')).arrayBuffer());
        this.buffers['click'] = await this.actx.decodeAudioData(await (await fetch('sounds/click.wav')).arrayBuffer());
        this.buffers['coin'] = await this.actx.decodeAudioData(await (await fetch('sounds/coin.wav')).arrayBuffer());
        this.buffers['level'] = await this.actx.decodeAudioData(await (await fetch('sounds/level.wav')).arrayBuffer());
        this.buffers['lose'] = await this.actx.decodeAudioData(await (await fetch('sounds/lose.wav')).arrayBuffer());
        this.buffers['nope'] = await this.actx.decodeAudioData(await (await fetch('sounds/nope.wav')).arrayBuffer());
    }

    play(soundID: string) {
        const source = this.actx.createBufferSource();
        source.buffer = this.buffers[soundID];
        source.connect(this.actx.destination);
        source.start();
    }
}