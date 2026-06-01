// Plays a two-tone PA-style chime using the Web Audio API.
// Returns a Promise that resolves when the chime finishes (~1.1s).
const playChime = () =>
  new Promise((resolve) => {
    try {
      const Ctx = window.AudioContext;
      if (!Ctx) { resolve(); return; }

      const ctx = new Ctx();
      const now = ctx.currentTime;

      // Descending two-tone chime: A5 (880 Hz) then E5 (659 Hz)
      [
        [880, now,        now + 0.65],
        [659, now + 0.4,  now + 0.95],
      ].forEach(([freq, start, end]) => {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(1, start + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, end);
        osc.start(start);
        osc.stop(end);
      });

      setTimeout(() => { ctx.close(); resolve(); }, 1100);
    } catch {
      resolve();
    }
  });

export const speakQueue = async (queueNumber, studio) => {
  if (!("speechSynthesis" in window)) return;

  await playChime();

  const digitToWord = {
    '0': 'zero','1': 'one','2': 'two','3': 'three','4': 'four',
    '5': 'five','6': 'six','7': 'seven','8': 'eight','9': 'nine',
  };

  const formattedNum = queueNumber
    .toString()
    .split('')
    .map(d => digitToWord[d] || d)
    .join(', ');

  const formattedStudio = studio
    ?.replace('Studio ', 'Studio, ')
    ?.replace('Counter ', 'Counter, ') || '';

  const text = `${formattedNum}.. ${formattedStudio}`;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.lang = 'en-US';
  utterance.rate = 0.68;
  utterance.pitch = 1.08;
  utterance.volume = 0.98;

  const voices = window.speechSynthesis.getVoices();
  const voice =
    voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) ||
    voices.find(v => v.lang.startsWith('en')) ||
    voices[0];

  if (voice) utterance.voice = voice;

  window.speechSynthesis.speak(utterance);
};