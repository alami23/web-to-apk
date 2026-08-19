'use client';

import React from 'react';
import {
  Globe,
  Smartphone,
  Package,
  Tag,
  Compass,
  Maximize2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers,
  ShieldCheck,
  Sparkles,
  Info,
} from 'lucide-react';
import { AppConfig, ScreenOrientation } from '@/types/app-config';

interface GeneralSettingsProps {
  config: AppConfig;
  onChange: (updated: Partial<AppConfig>) => void;
}

interface SdkOption {
  api: number;
  version: string;
  codeName: string;
  releaseYear: string;
  deviceReach: string;
  isTargetRecommended?: boolean;
  isMinRecommended?: boolean;
}

const ANDROID_SDK_OPTIONS: SdkOption[] = [
  { api: 36, version: 'Android 16', codeName: 'Baklava (Preview / 16)', releaseYear: '2025/2026', deviceReach: 'Android 16 Dev Preview' },
  { api: 35, version: 'Android 15', codeName: 'Vanilla Ice Cream', releaseYear: '2024', deviceReach: '~35% Latest Devices', isTargetRecommended: true },
  { api: 34, version: 'Android 14', codeName: 'Upside Down Cake', releaseYear: '2023', deviceReach: '~65% Devices' },
  { api: 33, version: 'Android 13', codeName: 'Tiramisu', releaseYear: '2022', deviceReach: '~78% Devices' },
  { api: 32, version: 'Android 12L', codeName: 'Sv2 (Tablets/Foldables)', releaseYear: '2022', deviceReach: '~82% Devices' },
  { api: 31, version: 'Android 12', codeName: 'Snow Cone', releaseYear: '2021', deviceReach: '~85% Devices' },
  { api: 30, version: 'Android 11', codeName: 'Red Velvet Cake', releaseYear: '2020', deviceReach: '~89% Devices' },
  { api: 29, version: 'Android 10', codeName: 'Quince Tart (Q)', releaseYear: '2019', deviceReach: '~93% Devices' },
  { api: 28, version: 'Android 9.0', codeName: 'Pie', releaseYear: '2018', deviceReach: '~95% Devices' },
  { api: 26, version: 'Android 8.0', codeName: 'Oreo', releaseYear: '2017', deviceReach: '~97% Devices' },
  { api: 24, version: 'Android 7.0', codeName: 'Nougat', releaseYear: '2016', deviceReach: '~98.5% Devices' },
  { api: 23, version: 'Android 6.0', codeName: 'Marshmallow', releaseYear: '2015', deviceReach: '~99.2% Devices' },
  { api: 21, version: 'Android 5.0', codeName: 'Lollipop', releaseYear: '2014', deviceReach: '99.9% Devices', isMinRecommended: true },
  { api: 19, version: 'Android 4.4', codeName: 'KitKat', releaseYear: '2013', deviceReach: '99.95% Devices' },
  { api: 16, version: 'Android 4.1', codeName: 'Jelly Bean', releaseYear: '2012', deviceReach: '~100% (Max Legacy)' },
];

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({ config, onChange }) => {
  const [urlStatus, setUrlStatus] = React.useState<'valid' | 'invalid' | 'neutral'>('neutral');

  const currentMinSdk = config.minSdk || 21;
  const currentTargetSdk = config.targetSdk || 35;

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value.trim();
    
    try {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        new URL(url);
        setUrlStatus('valid');
      } else {
        setUrlStatus('neutral');
      }
    } catch {
      setUrlStatus('invalid');
    }

    onChange({ webUrl: url });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const updates: Partial<AppConfig> = { appName: name };

    // If package name looks default or empty, suggest one based on app name
    const sanitized = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (sanitized && (config.packageName.startsWith('com.example.') || config.packageName === 'com.mycompany.mywebapp')) {
      updates.packageName = `com.app.${sanitized}`;
    }

    onChange(updates);
  };

  const handleTargetSdkChange = (target: number) => {
    const updates: Partial<AppConfig> = { targetSdk: target };
    if (currentMinSdk > target) {
      updates.minSdk = target;
    }
    onChange(updates);
  };

  const handleMinSdkChange = (min: number) => {
    const updates: Partial<AppConfig> = { minSdk: min };
    if (min > currentTargetSdk) {
      updates.targetSdk = min;
    }
    onChange(updates);
  };

  const handleApplySdkPreset = (min: number, target: number) => {
    onChange({ minSdk: min, targetSdk: target });
  };

  const orientations: { id: ScreenOrientation; label: string; desc: string }[] = [
    { id: 'portrait', label: 'Portrait', desc: 'Standard mobile view' },
    { id: 'auto', label: 'Auto Rotate', desc: 'Sensor driven rotation' },
    { id: 'landscape', label: 'Landscape', desc: 'Wide screen / Games' },
    { id: 'sensor_portrait', label: 'Sensor Portrait', desc: 'Portrait upright or inverted' },
  ];

  const targetSdkInfo = ANDROID_SDK_OPTIONS.find((s) => s.api === currentTargetSdk) || {
    api: currentTargetSdk,
    version: `API ${currentTargetSdk}`,
    codeName: 'Custom SDK',
    releaseYear: '',
    deviceReach: '',
  };

  const minSdkInfo = ANDROID_SDK_OPTIONS.find((s) => s.api === currentMinSdk) || {
    api: currentMinSdk,
    version: `API ${currentMinSdk}`,
    codeName: 'Custom SDK',
    releaseYear: '',
    deviceReach: '',
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900">App Core & URL Configuration</h2>
        <p className="text-sm text-slate-500">
          Transform any responsive website into a native-feeling Android application.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Web URL input */}
        <div className="sm:col-span-2 space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Source URL *
            </label>
            {config.webUrl && (
              <a
                href={config.webUrl.startsWith('http') ? config.webUrl : `https://${config.webUrl}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline"
              >
                Test in browser <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
          <div className="relative">
            <input
              id="input-web-url"
              type="url"
              value={config.webUrl}
              onChange={handleUrlChange}
              placeholder="https://yourwebsite.com or https://myapp.vercel.app"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm text-slate-900 outline-none transition-all"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              {urlStatus === 'valid' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
              {urlStatus === 'invalid' && <AlertCircle className="h-4 w-4 text-amber-500" />}
            </div>
          </div>
          <p className="text-xs text-slate-400">
            This URL will load immediately inside the native Android WebView upon opening.
          </p>
        </div>

        {/* App Name */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            App Display Name *
          </label>
          <input
            id="input-app-name"
            type="text"
            value={config.appName}
            onChange={handleNameChange}
            placeholder="e.g. Echo Reader"
            maxLength={35}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm text-slate-900 outline-none transition-all"
          />
          <p className="text-xs text-slate-400">
            App label shown below the icon on the Android launcher.
          </p>
        </div>

        {/* Package Name */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Package Name (Application ID) *
          </label>
          <input
            id="input-package-name"
            type="text"
            value={config.packageName}
            onChange={(e) => onChange({ packageName: e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, '') })}
            placeholder="com.company.appname"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white font-mono text-xs text-slate-900 outline-none transition-all"
          />
          <p className="text-xs text-slate-400">
            Unique identifier in reverse-domain format (e.g. <code className="font-mono text-slate-600">com.app.reader</code>).
          </p>
        </div>

        {/* Version Name & Code */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Version Name
            </label>
            <input
              id="input-version-name"
              type="text"
              value={config.versionName}
              onChange={(e) => onChange({ versionName: e.target.value })}
              placeholder="1.0.0"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs text-slate-900 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Version Code
            </label>
            <input
              id="input-version-code"
              type="number"
              min="1"
              value={config.versionCode}
              onChange={(e) => onChange({ versionCode: parseInt(e.target.value) || 1 })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs text-slate-900 outline-none transition-all"
            />
          </div>
        </div>

        {/* Fullscreen Toggle */}
        <div className="flex flex-col justify-end space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Display Mode
          </label>
          <label className="flex cursor-pointer items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl transition hover:bg-slate-100/80">
            <div className="flex items-center gap-2.5">
              <Maximize2 className="h-4 w-4 text-indigo-600" />
              <div>
                <span className="block text-xs font-semibold text-slate-800">Fullscreen Immersive Mode</span>
                <span className="block text-[10px] text-slate-500">Hide Android status bar and navigation bar</span>
              </div>
            </div>
            <input
              id="toggle-fullscreen"
              type="checkbox"
              checked={config.fullscreen}
              onChange={(e) => onChange({ fullscreen: e.target.checked })}
              className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </label>
        </div>
      </div>

      {/* Android SDK Version Controls */}
      <div className="space-y-4 rounded-2xl border border-indigo-100 bg-gradient-to-b from-indigo-50/40 to-slate-50/60 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-indigo-100/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
              <Cpu className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Android SDK Version & Platform Compatibility</h3>
              <p className="text-xs text-slate-500">Configure target API levels for modern devices and backwards compatibility</p>
            </div>
          </div>

          {/* Quick Preset Selector Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 sm:pt-0">
            <button
              type="button"
              id="btn-sdk-preset-android16"
              onClick={() => handleApplySdkPreset(21, 36)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                currentTargetSdk === 36
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50'
              }`}
            >
              🤖 Android 16 (API 36)
            </button>
            <button
              type="button"
              id="btn-sdk-preset-standard"
              onClick={() => handleApplySdkPreset(21, 35)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                currentTargetSdk === 35 && currentMinSdk === 21
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              ⭐ Android 15 (API 35)
            </button>
            <button
              type="button"
              id="btn-sdk-preset-legacy"
              onClick={() => handleApplySdkPreset(16, 35)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                currentMinSdk === 16
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              🌍 SDK 16+ (Max Reach)
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Target SDK Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="select-target-sdk" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Target SDK (targetSdkVersion) *
              </label>
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-800">
                API {currentTargetSdk}
              </span>
            </div>
            <select
              id="select-target-sdk"
              value={currentTargetSdk}
              onChange={(e) => handleTargetSdkChange(parseInt(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs font-medium text-slate-900 outline-none shadow-xs transition"
            >
              {ANDROID_SDK_OPTIONS.map((sdk) => (
                <option key={`target-${sdk.api}`} value={sdk.api}>
                  API {sdk.api} — {sdk.version} ({sdk.codeName}) {sdk.api === 36 ? '★ Latest' : sdk.isTargetRecommended ? '★ Recommended' : ''}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500">
              The platform version the app is tested against. Target <strong>API 34–36</strong> is required for modern Android 14/15/16 devices.
            </p>
          </div>

          {/* Minimum SDK Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="select-min-sdk" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Minimum SDK (minSdkVersion) *
              </label>
              <span className="rounded-full bg-slate-200 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                API {currentMinSdk}
              </span>
            </div>
            <select
              id="select-min-sdk"
              value={currentMinSdk}
              onChange={(e) => handleMinSdkChange(parseInt(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs font-medium text-slate-900 outline-none shadow-xs transition"
            >
              {ANDROID_SDK_OPTIONS.map((sdk) => (
                <option key={`min-${sdk.api}`} value={sdk.api}>
                  API {sdk.api} — {sdk.version} ({sdk.deviceReach}) {sdk.api === 16 ? '★ Max Legacy' : sdk.isMinRecommended ? '★ Standard' : ''}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500">
              Oldest Android version allowed to install your app. <strong>API 16 (Jelly Bean)</strong> or <strong>API 21 (Lollipop)</strong> ensures maximum phone reach.
            </p>
          </div>
        </div>

        {/* Compatibility summary card */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-indigo-200/70 bg-white p-3.5 text-xs shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">
                  {targetSdkInfo.version} Target (API {currentTargetSdk})
                </span>
                <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.2 text-[10px] font-semibold">
                  {currentTargetSdk >= 34 ? 'Play Store & Android 16 Ready' : 'Compatible'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Runs on {minSdkInfo.version}+ ({minSdkInfo.codeName}) up to {targetSdkInfo.version} with full hardware acceleration.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto font-mono text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <span>minSdk = <strong>{currentMinSdk}</strong></span>
            <span>•</span>
            <span>targetSdk = <strong>{currentTargetSdk}</strong></span>
          </div>
        </div>
      </div>

      {/* Screen Orientation */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
          Screen Orientation Lock
        </label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {orientations.map((item) => {
            const isSelected = config.orientation === item.id;
            return (
              <button
                key={item.id}
                type="button"
                id={`btn-orientation-${item.id}`}
                onClick={() => onChange({ orientation: item.id })}
                className={`flex flex-col items-start rounded-xl border p-3.5 text-left transition ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/60 text-indigo-900 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                <span className="text-xs font-bold">{item.label}</span>
                <span className="text-[10px] text-slate-500">{item.desc}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
