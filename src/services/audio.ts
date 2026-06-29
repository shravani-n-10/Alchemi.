class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private brownNoiseNode: AudioWorkletNode | ScriptProcessorNode | null = null;
  private rainNode: ScriptProcessorNode | null = null;
  private lofiOscillator: OscillatorNode | null = null;
  private lofiGain: GainNode | null = null;

  // Volume nodes
  private brownNoiseGain: GainNode | null = null;
  private rainGain: GainNode | null = null;

  constructor() {
    // AudioContext will be initialized on user interaction due to browser autoplay policies
  }

  private init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();
  }

  /**
   * Starts synthesizing Brown Noise (deep, soothing rumble).
   */
  public startBrownNoise(volume: number = 0.5) {
    this.init();
    if (!this.ctx) return;

    if (this.brownNoiseNode) {
      this.setBrownNoiseVolume(volume);
      return;
    }

    const bufferSize = 4096;
    let lastOut = 0.0;

    // Create custom node using ScriptProcessor for maximum compatibility in older browsers
    this.brownNoiseNode = this.ctx.createScriptProcessor(bufferSize, 1, 1);
    this.brownNoiseNode.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Brown noise filter formula
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Amplify slightly
      }
    };

    this.brownNoiseGain = this.ctx.createGain();
    this.brownNoiseGain.gain.value = volume;

    this.brownNoiseNode.connect(this.brownNoiseGain);
    this.brownNoiseGain.connect(this.ctx.destination);
  }

  public stopBrownNoise() {
    if (this.brownNoiseNode) {
      this.brownNoiseNode.disconnect();
      this.brownNoiseNode = null;
    }
    this.brownNoiseGain = null;
  }

  public setBrownNoiseVolume(volume: number) {
    if (this.brownNoiseGain) {
      this.brownNoiseGain.gain.setValueAtTime(volume, this.ctx?.currentTime || 0);
    }
  }

  /**
   * Starts synthesizing Rain (pitter-patter + high-frequency crackle).
   */
  public startRain(volume: number = 0.5) {
    this.init();
    if (!this.ctx) return;

    if (this.rainNode) {
      this.setRainVolume(volume);
      return;
    }

    const bufferSize = 4096;
    this.rainNode = this.ctx.createScriptProcessor(bufferSize, 1, 1);
    this.rainNode.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // High-pass filter simulation + crackle pitter-patter
        const pitter = Math.random() > 0.98 ? Math.random() : 0;
        output[i] = white * 0.03 + pitter * 0.12;
      }
    };

    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.value = volume;

    // Connect bandpass filter to give rain its specific tone
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000; // Tone of rain
    filter.Q.value = 0.8;

    this.rainNode.connect(filter);
    filter.connect(this.rainGain);
    this.rainGain.connect(this.ctx.destination);
  }

  public stopRain() {
    if (this.rainNode) {
      this.rainNode.disconnect();
      this.rainNode = null;
    }
    this.rainGain = null;
  }

  public setRainVolume(volume: number) {
    if (this.rainGain) {
      this.rainGain.gain.setValueAtTime(volume, this.ctx?.currentTime || 0);
    }
  }

  /**
   * Synthesizes a beautiful success chime arpeggio (C4 -> E4 -> G4 -> C5).
   */
  public playSuccessChime() {
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5

    notes.forEach((freq, index) => {
      const osc = this.ctx!.createOscillator();
      const gainNode = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * 0.1);

      // Volume envelope (fade in and fade out)
      gainNode.gain.setValueAtTime(0, now + index * 0.1);
      gainNode.gain.linearRampToValueAtTime(0.15, now + index * 0.1 + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.1 + 0.6);

      osc.connect(gainNode);
      gainNode.connect(this.ctx!.destination);

      osc.start(now + index * 0.1);
      osc.stop(now + index * 0.1 + 0.65);
    });
  }

  /**
   * Stops all ambient audio.
   */
  public stopAll() {
    this.stopBrownNoise();
    this.stopRain();
  }
}

export const audioSynth = new AudioSynthesizer();
export default audioSynth;
