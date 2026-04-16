// QueueTest.jsx  (updated for slow + paused number reading)

import { useState, useEffect } from 'react';

export default function QueueTest() {
  const [queueNumber, setQueueNumber] = useState('');
  const [studio, setStudio] = useState('Studio A');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastSpoken, setLastSpoken] = useState('');

  const digitToWord = {
    '0': 'zero',
    '1': 'one',
    '2': 'two',
    '3': 'three',
    '4': 'four',
    '5': 'five',
    '6': 'six',
    '7': 'seven',
    '8': 'eight',
    '9': 'nine',
  };

  const formatQueueNumber = (num) => {
    if (!num) return '';
    // Join with comma → browser adds small natural pause
    return num
      .split('')
      .map(digit => digitToWord[digit] || digit)
      .join(', ');
  };

  const getFullText = () => {
  const formattedNum = formatQueueNumber(queueNumber);

  const formattedStudio = studio
    .replace('Studio ', 'Studio, ')
    .replace('Counter ', 'Counter, ');

  return `${formattedNum}.. ${formattedStudio}`;
};

 const speak = (text) => {
  if (!('speechSynthesis' in window)) {
    alert("Your browser doesn't support text-to-speech");
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.lang   = 'en-US';
  utterance.rate   = 0.68;     
  utterance.pitch  = 1.08;     
  utterance.volume = 0.98;

  // Pick best voice for pauses & clarity (Google voices handle punctuation best)
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = 
    voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) ||
    voices.find(v => v.lang.startsWith('en-US') || v.lang.startsWith('en-GB')) ||
    voices[0];

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  utterance.onstart = () => setIsSpeaking(true);
  utterance.onend   = () => setIsSpeaking(false);

  window.speechSynthesis.speak(utterance);
  setLastSpoken(text);
};

  const handleCallNow = () => {
    const text = getFullText();
    if (text.trim()) {
      speak(text);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCallNow();
    }
  };

  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '500px',
      margin: '2rem auto',
      fontFamily: 'system-ui, sans-serif',
      textAlign: 'center',
    }}>
      <h1 style={{ color: '#2c3e50' }}>Queue Number Test (Slow + Paused)</h1>
      <p style={{ color: '#7f8c8d', marginBottom: '2rem' }}>
        Try: 6016 → should sound like "six, zero, one, six... Studio A"
      </p>

      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          value={queueNumber}
          onChange={(e) => setQueueNumber(e.target.value.replace(/\D/g, ''))}
          onKeyDown={handleKeyDown}
          placeholder="e.g. 6016"
          maxLength={6}
          style={{
            fontSize: '2.4rem',
            width: '200px',
            textAlign: 'center',
            padding: '0.8rem',
            border: '2px solid #3498db',
            borderRadius: '8px',
          }}
          autoFocus
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <select
          value={studio}
          onChange={(e) => setStudio(e.target.value)}
          style={{
            fontSize: '1.4rem',
            padding: '0.7rem 1.2rem',
            borderRadius: '6px',
          }}
        >
          <option value="Studio A">Studio A</option>
          <option value="Studio B">Studio B</option>
          <option value="Studio 1">Studio 1</option>
          <option value="Studio 2">Studio 2</option>
          <option value="Counter A">Counter A</option>
          <option value="Counter B">Counter B</option>
        </select>
      </div>

      <button
        onClick={handleCallNow}
        disabled={isSpeaking || !queueNumber.trim()}
        style={{
          fontSize: '1.5rem',
          padding: '1rem 3rem',
          background: isSpeaking ? '#e74c3c' : '#27ae60',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: (isSpeaking || !queueNumber.trim()) ? 'not-allowed' : 'pointer',
          margin: '1.2rem 0',
          minWidth: '240px',
        }}
      >
        {isSpeaking ? 'Speaking...' : 'Call Now'}
      </button>

      {lastSpoken && (
        <div style={{ marginTop: '2.5rem', color: '#7f8c8d' }}>
          <small>Last spoken text:</small><br />
          <strong style={{ fontSize: '1.4rem', color: '#2c3e50' }}>
            {lastSpoken}
          </strong>
        </div>
      )}

      <div style={{ marginTop: '3.5rem', fontSize: '0.95rem', color: '#95a5a6' }}>
        Tips:<br />
        • Chrome + Google voice usually gives clearest slow reading<br />
        • Try rate values: 0.65 (very slow), 0.75 (still slow but faster)<br />
        • If too slow/fast → edit utterance.rate = 0.XX in the code
      </div>
    </div>
  );
}