import { Component, createSignal, Show } from "solid-js"
import { Select } from "@opencode-ai/ui/select"
import { Switch } from "@opencode-ai/ui/switch"
import { InlineInput } from "@opencode-ai/ui/inline-input"
import { useLanguage } from "@/context/language"
import { useSettings } from "@/context/settings"
import { SettingsList } from "./settings-list"
import { SettingsRow } from "./settings-row"
import { isIOS } from "@/utils/tts"

type SpeechBackend = "web-speech-api" | "openai-compatible"

const backendOptions: { value: SpeechBackend; label: string }[] = [
  { value: "web-speech-api", label: "Web Speech API" },
  { value: "openai-compatible", label: "OpenAI Compatible" },
]

export const SettingsSpeech: Component = () => {
  const language = useLanguage()
  const settings = useSettings()
  const [selectedBackend, setSelectedBackend] = createSignal<SpeechBackend>(
    settings.general.speechBackend(),
  )

  const handleBackendSelect = (backend: SpeechBackend | undefined) => {
    if (backend) {
      setSelectedBackend(backend)
      settings.general.setSpeechBackend(backend)
    }
  }

  return (
    <div class="flex flex-col h-full overflow-y-auto no-scrollbar px-4 pb-10 sm:px-10 sm:pb-10">
      <div class="sticky top-0 z-10 bg-[linear-gradient(to_bottom,var(--surface-stronger-non-alpha)_calc(100%_-_24px),transparent)]">
        <div class="flex flex-col gap-1 pt-6 pb-8">
          <h2 class="text-16-medium text-text-strong">{language.t("settings.tab.speech")}</h2>
          <p class="text-13-regular text-text-weak">{language.t("settings.speech.subtitle")}</p>
        </div>
      </div>

      <div class="flex flex-col gap-8 w-full">
        <SettingsList>
          <SettingsRow
            title={language.t("settings.speech.row.speakResponses.title")}
            description={language.t("settings.speech.row.speakResponses.description")}
          >
            <div data-action="settings-speak-responses">
              <Switch
                checked={settings.general.speakResponses()}
                onChange={(checked) => settings.general.setSpeakResponses(checked)}
              />
            </div>
          </SettingsRow>

          <SettingsRow
            title={language.t("settings.speech.row.backend.title")}
            description={language.t("settings.speech.row.backend.description")}
          >
            <Select
              data-action="settings-speech-backend"
              options={backendOptions}
              current={backendOptions.find((o) => o.value === selectedBackend())}
              value={(o) => o.value}
              label={(o) => o.label}
              onSelect={(o) => handleBackendSelect(o?.value)}
              variant="secondary"
              size="small"
              triggerVariant="settings"
            />
          </SettingsRow>

          <Show when={selectedBackend() === "openai-compatible"}>
            <SettingsRow
              title={language.t("settings.speech.row.backendUrl.title")}
              description={language.t("settings.speech.row.backendUrl.description")}
            >
              <div class="flex flex-col gap-2">
                <InlineInput
                  data-action="settings-speech-backend-url"
                  type="text"
                  placeholder={language.t("settings.speech.row.backendUrl.placeholder")}
                  value={settings.general.speechBackendUrl()}
                  onInput={(e) => settings.general.setSpeechBackendUrl(e.currentTarget.value)}
                  style={{ width: "280px" }}
                />
                <InlineInput
                  data-action="settings-speech-backend-token"
                  type="password"
                  placeholder={language.t("settings.speech.row.backendToken.placeholder")}
                  value={settings.general.speechBackendToken()}
                  onInput={(e) => settings.general.setSpeechBackendToken(e.currentTarget.value)}
                  style={{ width: "280px" }}
                />
              </div>
            </SettingsRow>
          </Show>
        </SettingsList>

        <Show when={isIOS()}>
          <div class="text-13-regular text-text-weak">
            {language.t("settings.speech.iosWarning")}
          </div>
        </Show>
      </div>
    </div>
  )
}