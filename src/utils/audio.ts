/**
 * Sensory-Safe Web Audio Synthesizer
 * Provides Brownian Noise & Soft Ambient Chimes for neurodivergent focus and soothing.
 */

let audioCtx: AudioContext | null = null;
let brownNoiseNode: AudioNode | null = null;
let gainNode: GainNode | null = null;
let isPlaying = false;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Generate 5 seconds of looping calibrated Brown Noise (Brownian noise)
 * Brown noise falls off at 6dB per octave, producing a warm, low rumble.
 */
function createBrownNoiseBuffer(ctx: AudioContext): AudioBuffer {
  const bufferSize = ctx.sampleRate * 5;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let lastOut = 0.0;

  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    lastOut = (lastOut + 0.02 * white) / 1.02;
    data[i] = lastOut * 3.5; // Gain scaling for warmth
  }

  return buffer;
}

export const sensoryAudio = {
  startBrownNoise(volume = 0.35): boolean {
    try {
      if (isPlaying) return true;
      const ctx = getAudioContext();

      const bufferSource = ctx.createBufferSource();
      bufferSource.buffer = createBrownNoiseBuffer(ctx);
      bufferSource.loop = true;

      // Low pass filter to remove harsh high frequencies
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);

      gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(Math.max(0.01, volume), ctx.currentTime + 1.2);

      bufferSource.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      bufferSource.start();
      brownNoiseNode = bufferSource;
      isPlaying = true;
      return true;
    } catch (e) {
      console.warn("AudioContext unavailable or blocked:", e);
      return false;
    }
  },

  stopBrownNoise() {
    if (!isPlaying || !gainNode || !audioCtx) return;
    try {
      const ctx = audioCtx;
      gainNode.gain.setValueAtTime(gainNode.gain.value, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      setTimeout(() => {
        if (brownNoiseNode && 'stop' in brownNoiseNode) {
          (brownNoiseNode as AudioBufferSourceNode).stop();
        }
        brownNoiseNode = null;
        isPlaying = false;
      }, 700);
    } catch (e) {
      isPlaying = false;
    }
  },

  isNoisePlaying(): boolean {
    return isPlaying;
  },

  setVolume(volume: number) {
    if (gainNode && audioCtx) {
      gainNode.gain.setValueAtTime(Math.max(0.001, Math.min(1, volume)), audioCtx.currentTime);
    }
  },

  /**
   * Play a gentle, soft singing-bowl harmonic chime for task completion / timer end.
   * Completely gentle, no startling high-frequency beep.
   */
  playGentleChime() {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const oscHarmonic = ctx.createOscillator();
      const chimeGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, ctx.currentTime); // 528 Hz Solfeggio soothing frequency
      oscHarmonic.type = 'sine';
      oscHarmonic.frequency.setValueAtTime(1056, ctx.currentTime);

      chimeGain.gain.setValueAtTime(0.001, ctx.currentTime);
      chimeGain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.08);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);

      osc.connect(chimeGain);
      oscHarmonic.connect(chimeGain);
      chimeGain.connect(ctx.destination);

      osc.start();
      oscHarmonic.start();
      osc.stop(ctx.currentTime + 2.6);
      oscHarmonic.stop(ctx.currentTime + 2.6);
    } catch (e) {
      // Audio playback suppressed or blocked
    }
  },
};
