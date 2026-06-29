class SpeechService {
  private recognition: any = null;
  private synthesis: SpeechSynthesis | null = null;
  private selectedVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.setupVoice();

    // Setup Recognition if supported
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      this.recognition = new SpeechRecognitionClass();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
    }
  }

  private setupVoice() {
    if (!this.synthesis) return;

    const loadVoices = () => {
      const voices = this.synthesis!.getVoices();
      // Look for a premium-sounding English voice (Google US English, Microsoft Zira, etc.)
      this.selectedVoice =
        voices.find((v) => v.lang === 'en-US' && v.name.toLowerCase().includes('google')) ||
        voices.find((v) => v.lang === 'en-US' && v.name.toLowerCase().includes('natural')) ||
        voices.find((v) => v.lang.startsWith('en')) ||
        voices[0] ||
        null;
    };

    loadVoices();
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = loadVoices;
    }
  }

  /**
   * Speaks the provided text out loud.
   */
  public speak(text: string, onEnd?: () => void): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synthesis) {
        resolve();
        return;
      }

      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }
      utterance.rate = 1.05; // Slightly faster for a natural productivity coach feel
      utterance.pitch = 1.0;

      utterance.onend = () => {
        if (onEnd) onEnd();
        resolve();
      };

      utterance.onerror = () => {
        resolve();
      };

      this.synthesis.speak(utterance);
    });
  }

  /**
   * Cancels any active speech synthesis.
   */
  public stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  /**
   * Starts listening to user voice input.
   */
  public startListening(
    onResult: (transcript: string) => void,
    onError: (err: any) => void,
    onEnd: () => void
  ) {
    if (!this.recognition) {
      onError('Speech recognition not supported in this browser.');
      return;
    }

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    this.recognition.onerror = (event: any) => {
      onError(event.error);
    };

    this.recognition.onend = () => {
      onEnd();
    };

    try {
      this.recognition.start();
    } catch (e) {
      onError(e);
    }
  }

  /**
   * Stops listening to user voice input.
   */
  public stopListening() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  /**
   * Check if speech recognition is supported.
   */
  public isSpeechSupported(): boolean {
    return !!this.recognition;
  }
}

export const speechService = new SpeechService();
export default speechService;
