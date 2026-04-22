import { createSignal } from "solid-js"

const [speaking, setSpeaking] = createSignal(false)

const iOSVoiceNames = [
  "Maged",
  "Zuzana",
  "Sara",
  "Anna",
  "Melina",
  "Karen",
  "Samantha",
  "Daniel",
  "Rishi",
  "Moira",
  "Tessa",
  "Mónica",
  "Paulina",
  "Satu",
  "Amélie",
  "Thomas",
  "Carmit",
  "Lekha",
  "Mariska",
  "Damayanti",
  "Alice",
  "Kyoko",
  "Yuna",
  "Ellen",
  "Xander",
  "Nora",
  "Zosia",
  "Luciana",
  "Joana",
  "Ioana",
  "Milena",
  "Laura",
  "Alva",
  "Kanya",
  "Yelda",
  "Tian-Tian",
  "Sin-Ji",
  "Mei-Jia",
]

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

function getBestVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null

  if (isIOS()) {
    return voices.find((v) => iOSVoiceNames.includes(v.name)) || voices[0]
  }

  return voices.find((v) => v.default) || voices[0]
}

function getVoices(): Promise<SpeechSynthesisVoice[]> {
  const voices = speechSynthesis.getVoices()
  if (voices.length > 0) return Promise.resolve(voices)

  return new Promise((resolve) => {
    if (speechSynthesis.onvoiceschanged) {
      speechSynthesis.onvoiceschanged = () => {
        resolve(speechSynthesis.getVoices())
      }
    } else {
      resolve([])
    }
  })
}

export function speak(text: string, options?: { rate?: number; pitch?: number }) {
  if (!speechSynthesis) return

  speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  if (options?.rate) utterance.rate = options.rate
  if (options?.pitch) utterance.pitch = options.pitch

  getVoices().then((voices) => {
    const best = getBestVoice(voices)
    if (best) utterance.voice = best
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    setSpeaking(true)
    speechSynthesis.speak(utterance)
  })
}

export function stop() {
  speechSynthesis?.cancel()
  setSpeaking(false)
}

export function isSpeaking() {
  return speaking()
}