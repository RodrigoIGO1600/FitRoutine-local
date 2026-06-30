let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  return audioCtx;
}

function playBeep(frequency: number, startTime: number, duration: number) {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, startTime);

  gainNode.gain.setValueAtTime(0.3, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

export function playRestFinished() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // 3 beeps: 800Hz, 1000Hz, 1200Hz (ascending pattern)
  playBeep(800, now, 0.12);
  playBeep(1000, now + 0.15, 0.12);
  playBeep(1200, now + 0.3, 0.18);
}

export function playExerciseFinished() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // 2 short + 1 long: 1200Hz, 1400Hz, 900Hz (descending finish)
  playBeep(1200, now, 0.1);
  playBeep(1400, now + 0.12, 0.1);
  playBeep(900, now + 0.28, 0.25);
}

// Must be called inside a user gesture (click/touch) to unlock audio on mobile
export function unlockAudio() {
  const ctx = getAudioContext();

  // Play a silent buffer to unlock audio on iOS/Android
  const buffer = ctx.createBuffer(1, 1, 22050);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start(0);
}
