/**
 * Audio synthesis & Voice feedback engine for Tantsaha Connect in pure JavaScript
 */

class AudioVoiceEngine {
  constructor() {
    this.audioCtx = null;
    this.currentUtterance = null;
    this.listeners = new Set();
    this.progressInterval = null;
    this.isSpeaking = false;
    this.currentTitle = '';
    this.currentDuration = 10;
    this.currentElapsed = 0;
    this.currentLang = 'mg';
  }

  getAudioContext() {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  playChime(type = 'click') {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (type === 'alert') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(330, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.35);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'water') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.12);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      }
    } catch {
      // AudioContext fallback silently ignored
    }
  }

  speakText(text, title = 'Torolàlana', lang = 'mg', onEnd) {
    if (typeof window === 'undefined') return;

    this.stopAudio();
    this.playChime('click');

    this.isSpeaking = true;
    this.currentTitle = title;
    this.currentLang = lang;
    this.currentElapsed = 0;

    const words = (text || '').split(/\s+/).length;
    this.currentDuration = Math.max(4, Math.round(words / 2.5));

    this.notifyState();

    this.progressInterval = window.setInterval(() => {
      this.currentElapsed += 0.25;
      if (this.currentElapsed >= this.currentDuration) {
        this.stopAudio();
        if (onEnd) onEnd();
      } else {
        this.notifyState();
      }
    }, 250);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;

      const voices = window.speechSynthesis.getVoices();
      if (lang === 'mg') {
        const preferredVoice =
          voices.find((v) => v.lang.startsWith('mg')) ||
          voices.find((v) => v.lang.startsWith('id')) ||
          voices.find((v) => v.lang.startsWith('it')) ||
          voices.find((v) => v.lang.startsWith('fr'));
        if (preferredVoice) utterance.voice = preferredVoice;
        utterance.rate = 0.88;
        utterance.pitch = 1.0;
      } else {
        const frVoice = voices.find((v) => v.lang.startsWith('fr'));
        if (frVoice) utterance.voice = frVoice;
        utterance.rate = 0.95;
      }

      utterance.onend = () => {
        this.stopAudio();
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        // Handled silently
      };

      window.speechSynthesis.speak(utterance);
    }
  }

  speakConfirmation(messageMg = 'Vita ny fanoratana! Voatahiry ny fambolenao.') {
    this.playChime('success');
    this.speakText(messageMg, 'Fanamarinana', 'mg');
  }

  stopAudio() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.currentUtterance = null;
    this.currentElapsed = 0;
    this.notifyState();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener({
      isPlaying: this.isSpeaking,
      title: this.currentTitle,
      progress: this.currentDuration > 0 ? (this.currentElapsed / this.currentDuration) * 100 : 0,
      duration: this.currentDuration,
      lang: this.currentLang,
    });
    return () => {
      this.listeners.delete(listener);
    };
  }

  notifyState() {
    const progress = this.currentDuration > 0 ? Math.min(100, (this.currentElapsed / this.currentDuration) * 100) : 0;
    this.listeners.forEach((listener) => {
      listener({
        isPlaying: this.isSpeaking,
        title: this.currentTitle,
        progress,
        duration: this.currentDuration,
        lang: this.currentLang,
      });
    });
  }

  getCurrentState() {
    return {
      isPlaying: this.isSpeaking,
      title: this.currentTitle,
      progress: this.currentDuration > 0 ? Math.min(100, (this.currentElapsed / this.currentDuration) * 100) : 0,
      duration: this.currentDuration,
      lang: this.currentLang,
    };
  }
}

export const audioEngine = new AudioVoiceEngine();
