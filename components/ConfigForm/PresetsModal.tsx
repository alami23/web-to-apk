'use client';

import React from 'react';
import { X, Sparkles, ShoppingBag, LayoutDashboard, Newspaper, Check } from 'lucide-react';
import { APP_PRESETS, AppPreset } from '@/lib/presets';
import { AppConfig } from '@/types/app-config';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: AppPreset) => void;
  currentAppName: string;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShoppingBag': return <ShoppingBag className="h-5 w-5 text-emerald-600" />;
      case 'LayoutDashboard': return <LayoutDashboard className="h-5 w-5 text-indigo-600" />;
      case 'Newspaper': return <Newspaper className="h-5 w-5 text-orange-600" />;
      default: return <Sparkles className="h-5 w-5 text-purple-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">App Presets & Templates</h3>
              <p className="text-xs text-slate-500">Pick a pre-configured starter kit tailored for your industry</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 max-h-[60vh] overflow-y-auto pr-1">
          {APP_PRESETS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => {
                onSelectPreset(preset);
                onClose();
              }}
              className="group flex cursor-pointer flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition hover:border-emerald-500 hover:bg-emerald-50/30 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-xs">
                      {renderIcon(preset.icon)}
                    </div>
                    <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-950">
                      {preset.name}
                    </span>
                  </div>
                  <span className="rounded-full bg-slate-200/70 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                    {preset.category}
                  </span>
                </div>
                <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">{preset.description}</p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-200/60 pt-3 text-[11px]">
                <span className="text-slate-500 font-mono">
                  {preset.config.appName} • {preset.config.styling?.primaryColor}
                </span>
                <span className="font-bold text-emerald-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Apply Preset →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
