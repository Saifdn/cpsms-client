// utils/speakQueue.js
export const speakQueue = (queueNumber, studio) => {
  if (!("speechSynthesis" in window)) return;

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