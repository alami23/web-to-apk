'use client';

import React from 'react';
import {
  Sparkles,
  UploadCloud,
  Image as ImageIcon,
  Palette,
  Timer,
  Type,
  Layers,
  Check,
  RotateCcw,
  Globe,
  ShoppingBag,
  LayoutGrid,
  Newspaper,
  Rocket,
  ShieldCheck,
  Smartphone,
  Utensils,
  Film,
  MessageCircle,
  HeartPulse,
} from 'lucide-react';
import { AppBranding, AppStyling, IconShape, SplashAnimation, StatusBarStyle } from '@/types/app-config';
import { PRESET_ICONS } from '@/lib/presets';

interface BrandingCustomizerProps {
  branding: AppBranding;
  styling: AppStyling;
  appName: string;
  onBrandingChange: (updated: Partial<AppBranding>) => void;
  onStylingChange: (updated: Partial<AppStyling>) => void;
}

const COLOR_SWATCHES = [
  '#2563eb', // Blue
  '#059669', // Emerald
  '#4f46e5', // Indigo
  '#7c3aed', // Purple
  '#db2777', // Pink
  '#ea580c', // Orange
  '#0891b2', // Cyan
  '#0f172a', // Slate Dark
  '#18181b', // Zinc Black
  '#e11d48', // Rose
];

const GRADIENT_PRESETS = [
  { label: 'Deep Slate', value: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', bg: '#0f172a' },
  { label: 'Emerald Forest', value: 'linear-gradient(135deg, #065f46 0%, #022c22 100%)', bg: '#064e3b' },
  { label: 'Midnight Blue', value: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)', bg: '#1e3a8a' },
  { label: 'Sunset Amber', value: 'linear-gradient(135deg, #c2410c 0%, #7c2d12 100%)', bg: '#9a3412' },
  { label: 'Royal Purple', value: 'linear-gradient(135deg, #6b21a8 0%, #3b0764 100%)', bg: '#581c87' },
  { label: 'Minimal Dark', value: 'linear-gradient(135deg, #27272a 0%, #09090b 100%)', bg: '#18181b' },
];

export const BrandingCustomizer: React.FC<BrandingCustomizerProps> = ({
  branding,
  styling,
  appName,
  onBrandingChange,
  onStylingChange,
}) => {
  const iconFileInputRef = React.useRef<HTMLInputElement>(null);
  const splashFileInputRef = React.useRef<HTMLInputElement>(null);

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onBrandingChange({
          iconType: 'upload',
          iconDataUrl: event.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSplashUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onBrandingChange({
          splashType: 'upload',
          splashDataUrl: event.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const renderIconComponent = (id: string, className: string = 'h-6 w-6') => {
    switch (id) {
      case 'shopping-bag': return <ShoppingBag className={className} />;
      case 'layout-grid': return <LayoutGrid className={className} />;
      case 'newspaper': return <Newspaper className={className} />;
      case 'sparkles': return <Sparkles className={className} />;
      case 'rocket': return <Rocket className={className} />;
      case 'shield-check': return <ShieldCheck className={className} />;
      case 'smartphone': return <Smartphone className={className} />;
      case 'utensils': return <Utensils className={className} />;
      case 'film': return <Film className={className} />;
      case 'message-circle': return <MessageCircle className={className} />;
      case 'heart-pulse': return <HeartPulse className={className} />;
      case 'globe':
      default:
        return <Globe className={className} />;
    }
  };

  const shapes: { id: IconShape; label: string; roundedClass: string }[] = [
    { id: 'squircle', label: 'Squircle', roundedClass: 'rounded-2xl' },
    { id: 'circle', label: 'Circle', roundedClass: 'rounded-full' },
    { id: 'rounded', label: 'Rounded', roundedClass: 'rounded-xl' },
    { id: 'square', label: 'Square', roundedClass: 'rounded-none' },
  ];

  const splashAnimations: { id: SplashAnimation; label: string }[] = [
    { id: 'fade', label: 'Fade In' },
    { id: 'zoom', label: 'Zoom Scale' },
    { id: 'pulse', label: 'Pulse Glow' },
    { id: 'slide_up', label: 'Slide Up' },
  ];

  return (
    <div className="space-y-8">
      {/* SECTION 1: APP ICON */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900">App Icon & Launcher</h2>
          <p className="text-sm text-slate-500">
            Upload your own branded icon or generate a vector adaptive icon with custom shape & color.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-12">
          {/* Icon Preview Box */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:col-span-4">
            <div className="relative mb-3 flex items-center justify-center">
              <div
                className={`flex h-24 w-24 items-center justify-center shadow-lg transition-all duration-300 overflow-hidden ${
                  shapes.find((s) => s.id === branding.iconShape)?.roundedClass || 'rounded-2xl'
                }`}
                style={{ backgroundColor: branding.iconBgColor }}
              >
                {branding.iconType === 'upload' && branding.iconDataUrl ? (
                  <img
                    src={branding.iconDataUrl}
                    alt="App Icon Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-white drop-shadow-md">
                    {renderIconComponent(branding.iconPresetId, 'h-12 w-12')}
                  </div>
                )}
              </div>
            </div>
            <span className="text-xs font-bold text-slate-800">{appName || 'App Icon'}</span>
            <span className="text-[10px] text-slate-400">192×192px Android Adaptive</span>
          </div>

          {/* Icon Controls */}
          <div className="space-y-4 sm:col-span-8">
            {/* Upload or Preset tabs */}
            <div className="flex items-center gap-2 rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                id="btn-icon-preset-tab"
                onClick={() => onBrandingChange({ iconType: 'preset' })}
                className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${
                  branding.iconType === 'preset'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Vector Presets
              </button>
              <button
                type="button"
                id="btn-icon-upload-tab"
                onClick={() => onBrandingChange({ iconType: 'upload' })}
                className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${
                  branding.iconType === 'upload'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Upload Custom Image
              </button>
            </div>

            {branding.iconType === 'upload' ? (
              <div
                onClick={() => iconFileInputRef.current?.click()}
                className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 cursor-pointer transition-all"
              >
                <input
                  ref={iconFileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  onChange={handleIconUpload}
                  className="hidden"
                />
                <div className="w-10 h-10 bg-white rounded-lg shadow-xs border border-slate-200 flex items-center justify-center mb-1 text-indigo-600">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-700">Upload 512x512 icon</span>
                <span className="text-[11px] text-slate-400">PNG, SVG, JPG or WEBP</span>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {PRESET_ICONS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onBrandingChange({ iconPresetId: preset.id })}
                    className={`flex flex-col items-center justify-center rounded-xl border p-2 text-center transition ${
                      branding.iconPresetId === preset.id
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {renderIconComponent(preset.id, 'h-5 w-5')}
                    <span className="mt-1 text-[10px] font-medium truncate w-full">{preset.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Shape & Icon Background */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Icon Background Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={branding.iconBgColor}
                    onChange={(e) => onBrandingChange({ iconBgColor: e.target.value })}
                    className="h-8 w-10 cursor-pointer rounded-lg border border-slate-200 p-0.5 bg-white"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {COLOR_SWATCHES.slice(0, 6).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => onBrandingChange({ iconBgColor: c })}
                        className="h-6 w-6 rounded-full border border-slate-200 transition hover:scale-110"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Icon Mask Shape
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {shapes.map((shape) => (
                    <button
                      key={shape.id}
                      type="button"
                      onClick={() => onBrandingChange({ iconShape: shape.id })}
                      className={`rounded-lg border px-2 py-1.5 text-[11px] font-medium transition ${
                        branding.iconShape === shape.id
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-bold ring-1 ring-indigo-500/20'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {shape.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-slate-200" />

      {/* SECTION 2: SPLASH SCREEN */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900">Splash Screen (Launch Experience)</h2>
          <p className="text-sm text-slate-500">
            Customize the native opening screen shown while your website initialises.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Splash Background Type */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Splash Background Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'gradient', label: 'Gradient' },
                { id: 'solid', label: 'Solid Color' },
                { id: 'upload', label: 'Custom Image' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onBrandingChange({ splashType: item.id as AppBranding['splashType'] })}
                  className={`rounded-xl border p-2.5 text-xs font-bold transition ${
                    branding.splashType === item.id
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {branding.splashType === 'gradient' && (
              <div className="mt-3 space-y-2">
                <span className="text-[11px] font-medium text-slate-500">Preset Gradients:</span>
                <div className="grid grid-cols-3 gap-2">
                  {GRADIENT_PRESETS.map((g) => (
                    <button
                      key={g.label}
                      type="button"
                      onClick={() => onBrandingChange({ splashGradient: g.value, splashBgColor: g.bg })}
                      className="h-10 rounded-lg border border-slate-300 p-1 text-left text-[10px] font-bold text-white shadow-xs transition hover:scale-105 flex items-end"
                      style={{ background: g.value }}
                    >
                      <span className="bg-black/40 px-1 rounded truncate">{g.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {branding.splashType === 'solid' && (
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="color"
                  value={branding.splashBgColor}
                  onChange={(e) => onBrandingChange({ splashBgColor: e.target.value })}
                  className="h-9 w-12 cursor-pointer rounded-lg border border-slate-200 p-0.5 bg-white"
                />
                <span className="text-xs text-slate-600 font-mono">{branding.splashBgColor}</span>
              </div>
            )}

            {branding.splashType === 'upload' && (
              <div
                onClick={() => splashFileInputRef.current?.click()}
                className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 cursor-pointer transition-all"
              >
                <input
                  ref={splashFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleSplashUpload}
                  className="hidden"
                />
                <div className="w-10 h-10 bg-white rounded-lg shadow-xs border border-slate-200 flex items-center justify-center mb-1 text-indigo-600">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-700">Upload PNG or JPG</span>
                <span className="text-[11px] text-slate-400">High-resolution splash background</span>
              </div>
            )}
          </div>

          {/* Splash Duration & Animation */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Splash Duration
                </label>
                <span className="font-bold text-xs text-indigo-600">
                  {(branding.splashDurationMs / 1000).toFixed(1)}s
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="5000"
                step="250"
                value={branding.splashDurationMs}
                onChange={(e) => onBrandingChange({ splashDurationMs: parseInt(e.target.value) })}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0.5s (Fast)</span>
                <span>2.0s (Normal)</span>
                <span>5.0s (Long)</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Animation Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {splashAnimations.map((anim) => (
                  <button
                    key={anim.id}
                    type="button"
                    onClick={() => onBrandingChange({ splashAnimation: anim.id })}
                    className={`rounded-xl border p-2.5 text-xs font-medium transition ${
                      branding.splashAnimation === anim.id
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {anim.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Splash Tagline
              </label>
              <input
                type="text"
                value={branding.splashTagline}
                onChange={(e) => onBrandingChange({ splashTagline: e.target.value })}
                placeholder="e.g. Your daily dose of curated insights and articles."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs text-slate-900 outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <hr className="border-slate-200" />

      {/* SECTION 3: THEME COLORS & STATUS BAR */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900">Theme Colors & Native Status Bar</h2>
          <p className="text-sm text-slate-500">
            Configure system bars, pull-to-refresh spinner, and native highlight accents.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* Primary Color */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Primary Theme Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={styling.primaryColor}
                onChange={(e) => onStylingChange({ primaryColor: e.target.value, progressBarColor: e.target.value })}
                className="h-9 w-12 cursor-pointer rounded-lg border border-slate-200 p-0.5 bg-white"
              />
              <span className="font-mono text-xs text-slate-700 font-bold">{styling.primaryColor}</span>
            </div>
            <p className="text-[11px] text-slate-400">Affects top progress bar and refresh spinner.</p>
          </div>

          {/* Status Bar Background */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Status Bar Background</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={styling.statusBarColor}
                onChange={(e) => onStylingChange({ statusBarColor: e.target.value })}
                className="h-9 w-12 cursor-pointer rounded-lg border border-slate-200 p-0.5 bg-white"
              />
              <span className="font-mono text-xs text-slate-700 font-bold">{styling.statusBarColor}</span>
            </div>
            <p className="text-[11px] text-slate-400">Color behind time, battery, and wifi icons.</p>
          </div>

          {/* Status Bar Text Style */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Status Bar Icon Contrast</label>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => onStylingChange({ statusBarStyle: 'dark' })}
                className={`rounded-lg border px-2 py-2 text-[11px] font-bold transition ${
                  styling.statusBarStyle === 'dark'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                Dark Icons
              </button>
              <button
                type="button"
                onClick={() => onStylingChange({ statusBarStyle: 'light' })}
                className={`rounded-lg border px-2 py-2 text-[11px] font-bold transition ${
                  styling.statusBarStyle === 'light'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                Light Icons
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
