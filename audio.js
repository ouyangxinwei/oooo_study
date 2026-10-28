// Procedural moonlit castle ambience. No external audio files or network requests.
(function (global) {
  const melody = [
    { n: 293.66, d: 0.9 }, { n: 349.23, d: 0.6 }, { n: 392, d: 0.9 }, { n: 349.23, d: 0.6 },
    { n: 261.63, d: 0.9 }, { n: 293.66, d: 0.6 }, { n: 233.08, d: 1.2 }, { n: 0, d: 0.35 },
    { n: 293.66, d: 0.9 }, { n: 349.23, d: 0.6 }, { n: 440, d: 0.9 }, { n: 392, d: 0.6 },
    { n: 349.23, d: 0.9 }, { n: 293.66, d: 0.6 }, { n: 261.63, d: 1.2 }, { n: 0, d: 0.35 }
  ];

  function create(button) {
    let audioContext = null;
    let musicTimer = null;
    let enabled = false;
    let step = 0;

    function playNote() {
      if (!enabled || !audioContext) return;
      const note = melody[step % melody.length];
      step++;
      const now = audioContext.currentTime;

      if (note.n > 0) {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(note.n, now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.035, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + note.d * 0.92);
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start(now);
        oscillator.stop(now + note.d);

        if (step % 4 === 1) {
          const bass = audioContext.createOscillator();
          const bassGain = audioContext.createGain();
          bass.type = 'sine';
          bass.frequency.setValueAtTime(note.n / 2, now);
          bassGain.gain.setValueAtTime(0.0001, now);
          bassGain.gain.exponentialRampToValueAtTime(0.012, now + 0.08);
          bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);
          bass.connect(bassGain);
          bassGain.connect(audioContext.destination);
          bass.start(now);
          bass.stop(now + 1.12);
        }
      }

      musicTimer = global.setTimeout(playNote, Math.max(260, note.d * 1000));
    }

    async function setEnabled(on) {
      if (on) {
        try {
          const AudioContextClass = global.AudioContext || global.webkitAudioContext;
          if (!AudioContextClass) {
            button.textContent = '♫ 音乐不可用';
            return false;
          }
          if (!audioContext) audioContext = new AudioContextClass();
          if (audioContext.state === 'suspended') await audioContext.resume();
          enabled = true;
          button.textContent = '♫ 音乐：开启';
          button.setAttribute('aria-pressed', 'true');
          playNote();
          return true;
        } catch (_error) {
          enabled = false;
          button.textContent = '♫ 音乐：关闭';
          button.setAttribute('aria-pressed', 'false');
          return false;
        }
      }

      enabled = false;
      if (musicTimer) global.clearTimeout(musicTimer);
      musicTimer = null;
      if (audioContext && audioContext.state === 'running') audioContext.suspend();
      button.textContent = '♫ 音乐：关闭';
      button.setAttribute('aria-pressed', 'false');
      return true;
    }

    button.addEventListener('click', () => setEnabled(!enabled));
    return Object.freeze({ setEnabled, get enabled() { return enabled; } });
  }

  global.MoonlitAudio = Object.freeze({ create });
})(window);
