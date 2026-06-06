"use client";

import { useState } from "react";
import { X, Eye, EyeOff, Check } from "lucide-react";
import { loadSettings, saveSettings, type ChatSettings } from "@/hooks/use-ai-chat";

const MODELS = [
  { value: "gpt-4o-mini", label: "GPT-4o Mini (Fast & Cheap)" },
  { value: "gpt-4o", label: "GPT-4o (Most Capable)" },
  { value: "claude-sonnet-4-6", label: "Claude Sonnet 4.6" },
  { value: "claude-haiku-4-5", label: "Claude Haiku 4.5 (Fast)" },
  { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash (Google)" },
];

type AiSettingsDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AiSettingsDialog({ isOpen, onClose }: AiSettingsDialogProps) {
  const [settings, setSettings] = useState<ChatSettings>(loadSettings());
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-2xl border border-border/60 bg-card p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">AI Chat Settings</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-muted"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Model Selection */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Model
            </label>
            <select
              value={settings.model}
              onChange={(e) => setSettings((s) => ({ ...s, model: e.target.value }))}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30"
            >
              {MODELS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* API Key */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={settings.apiKey}
                onChange={(e) => setSettings((s) => ({ ...s, apiKey: e.target.value }))}
                placeholder="sk-... or ant-api03-..."
                className="h-10 w-full rounded-lg border border-input bg-background pr-10 pl-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {showKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Your key is stored locally in your browser and never sent to NileFlix servers except for AI requests.
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-95"
          >
            {saved ? (
              <>
                <Check className="size-4" />
                Saved!
              </>
            ) : (
              "Save Settings"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
