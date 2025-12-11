export class AudioManager {
    constructor() {
        this.context = null;
        this.sounds = {};
        this.enabled = true;
        this.masterVolume = 0.3;

        // Initialize audio context on first user interaction
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;

        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
            this.createSounds();
        } catch (e) {
            console.warn('Web Audio API not supported', e);
            this.enabled = false;
        }
    }

    createSounds() {
        // Waka-waka eating sound
        this.sounds.waka = {
            frequency: 440,
            duration: 0.05,
            type: 'square'
        };

        // Power pellet sound
        this.sounds.powerPellet = {
            frequency: 200,
            duration: 0.2,
            type: 'sine'
        };

        // Ghost siren (continuous)
        this.sounds.siren = {
            frequencies: [400, 500],
            duration: 0.5,
            type: 'sine'
        };

        // Death sound
        this.sounds.death = {
            startFreq: 800,
            endFreq: 100,
            duration: 1.0,
            type: 'sawtooth'
        };

        // Ghost eaten
        this.sounds.eatGhost = {
            frequency: 800,
            duration: 0.3,
            type: 'square'
        };
    }

    playWaka() {
        if (!this.enabled || !this.initialized) return;

        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.type = this.sounds.waka.type;
        oscillator.frequency.value = this.sounds.waka.frequency;

        gainNode.gain.value = this.masterVolume * 0.1;

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        oscillator.start();
        oscillator.stop(this.context.currentTime + this.sounds.waka.duration);
    }

    playPowerPellet() {
        if (!this.enabled || !this.initialized) return;

        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.type = this.sounds.powerPellet.type;
        oscillator.frequency.value = this.sounds.powerPellet.frequency;

        gainNode.gain.value = this.masterVolume * 0.2;
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            this.context.currentTime + this.sounds.powerPellet.duration
        );

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        oscillator.start();
        oscillator.stop(this.context.currentTime + this.sounds.powerPellet.duration);
    }

    playSiren() {
        if (!this.enabled || !this.initialized) return;

        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.type = this.sounds.siren.type;
        oscillator.frequency.value = this.sounds.siren.frequencies[0];

        // Alternate between two frequencies
        oscillator.frequency.setValueAtTime(
            this.sounds.siren.frequencies[0],
            this.context.currentTime
        );
        oscillator.frequency.setValueAtTime(
            this.sounds.siren.frequencies[1],
            this.context.currentTime + this.sounds.siren.duration / 2
        );

        gainNode.gain.value = this.masterVolume * 0.05;

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        oscillator.start();
        oscillator.stop(this.context.currentTime + this.sounds.siren.duration);
    }

    playDeath() {
        if (!this.enabled || !this.initialized) return;

        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.type = this.sounds.death.type;
        oscillator.frequency.value = this.sounds.death.startFreq;
        oscillator.frequency.exponentialRampToValueAtTime(
            this.sounds.death.endFreq,
            this.context.currentTime + this.sounds.death.duration
        );

        gainNode.gain.value = this.masterVolume * 0.2;
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            this.context.currentTime + this.sounds.death.duration
        );

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        oscillator.start();
        oscillator.stop(this.context.currentTime + this.sounds.death.duration);
    }

    playEatGhost() {
        if (!this.enabled || !this.initialized) return;

        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.type = this.sounds.eatGhost.type;
        oscillator.frequency.value = this.sounds.eatGhost.frequency;

        gainNode.gain.value = this.masterVolume * 0.15;
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            this.context.currentTime + this.sounds.eatGhost.duration
        );

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        oscillator.start();
        oscillator.stop(this.context.currentTime + this.sounds.eatGhost.duration);
    }

    stopAll() {
        // Web Audio API automatically stops sounds after their duration
        // This is a placeholder for future implementation if needed
    }
}
