import { Component } from "solid-js"
import { Select } from "@opencode-ai/ui/select"
import { Switch } from "@opencode-ai/ui/switch"
import { useLanguage } from "@/context/language"
import { useSettings } from "@/context/settings"
import { SettingsList } from "./settings-list"
import { SettingsRow } from "./settings-row"

const backendOptions = [{ value: "web-speech-api", label: "Web Speech API" }]

export const SettingsSpeech: Component = () => {
  const language = useLanguage()
  const settings = useSettings()

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
              current={backendOptions.find((o) => o.value === "web-speech-api")}
              value={(o) => o.value}
              label={(o) => o.label}
              onSelect={() => {}}
              variant="secondary"
              size="small"
              triggerVariant="settings"
            />
          </SettingsRow>
        </SettingsList>
      </div>
    </div>
  )
}