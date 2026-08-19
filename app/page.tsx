'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { GeneralSettings } from '@/components/ConfigForm/GeneralSettings';
import { PermissionsSection } from '@/components/ConfigForm/PermissionsSection';
import { BrandingCustomizer } from '@/components/ConfigForm/BrandingCustomizer';
import { WebViewControls } from '@/components/ConfigForm/WebViewControls';
import { PresetsModal } from '@/components/ConfigForm/PresetsModal';
import { PhoneSimulator } from '@/components/Simulator/PhoneSimulator';
import { BuildProgressModal } from '@/components/BuildModal/BuildProgressModal';
import { AppConfig, BuildResult } from '@/types/app-config';
import { DEFAULT_APP_CONFIG, AppPreset, APP_PRESETS } from '@/lib/presets';
import {
  Globe,
  Shield,
  Palette,
  Sliders,
  Sparkles,
  Smartphone,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

type TabType = 'general' | 'permissions' | 'branding' | 'webview';
const TAB_ORDER: TabType[] = ['general', 'permissions', 'branding', 'webview'];

const subscribeStorage = (callback: () => void) => {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
};

const getStorageSnapshot = () => {
  try {
    return localStorage.getItem('web2apk_config') || '';
  } catch {
    return '';
  }
};

const getServerStorageSnapshot = () => '';

export default function HomePage() {
  const [localConfig, setLocalConfig] = React.useState<AppConfig | null>(null);
  const savedStorage = React.useSyncExternalStore(
    subscribeStorage,
    getStorageSnapshot,
    getServerStorageSnapshot
  );

  const config: AppConfig = React.useMemo(() => {
    if (localConfig) return localConfig;
    if (savedStorage) {
      try {
        const parsed = JSON.parse(savedStorage);
        return {
          ...DEFAULT_APP_CONFIG,
          ...parsed,
          permissions: { ...DEFAULT_APP_CONFIG.permissions, ...(parsed.permissions || {}) },
          branding: { ...DEFAULT_APP_CONFIG.branding, ...(parsed.branding || {}) },
          styling: { ...DEFAULT_APP_CONFIG.styling, ...(parsed.styling || {}) },
          webView: { ...DEFAULT_APP_CONFIG.webView, ...(parsed.webView || {}) },
        };
      } catch {
        // Ignore
      }
    }
    return DEFAULT_APP_CONFIG;
  }, [localConfig, savedStorage]);

  const [activeTab, setActiveTab] = React.useState<TabType>('general');
  const [isPresetsOpen, setIsPresetsOpen] = React.useState(false);
  const [isBuildModalOpen, setIsBuildModalOpen] = React.useState(false);
  const [isBuilding, setIsBuilding] = React.useState(false);
  const [buildProgress, setBuildProgress] = React.useState(0);
  const [buildResult, setBuildResult] = React.useState<BuildResult | null>(null);
  const [buildError, setBuildError] = React.useState<string | null>(null);

  // Save changes to localStorage and local state
  const updateConfig = (updates: Partial<AppConfig>) => {
    const next: AppConfig = {
      ...config,
      ...updates,
      permissions: {
        ...config.permissions,
        ...(updates.permissions || {}),
      },
      branding: {
        ...config.branding,
        ...(updates.branding || {}),
      },
      styling: {
        ...config.styling,
        ...(updates.styling || {}),
      },
      webView: {
        ...config.webView,
        ...(updates.webView || {}),
      },
    };
    setLocalConfig(next);
    try {
      localStorage.setItem('web2apk_config', JSON.stringify(next));
    } catch {
      // Ignore
    }
  };

  const handleApplyPreset = (preset: AppPreset) => {
    const nextConfig: AppConfig = {
      ...config,
      ...preset.config,
      permissions: {
        ...config.permissions,
        ...(preset.config.permissions || {}),
      },
      branding: {
        ...config.branding,
        ...(preset.config.branding || {}),
      },
      styling: {
        ...config.styling,
        ...(preset.config.styling || {}),
      },
      webView: {
        ...config.webView,
        ...(preset.config.webView || {}),
      },
    };
    setLocalConfig(nextConfig);
    try {
      localStorage.setItem('web2apk_config', JSON.stringify(nextConfig));
    } catch {
      // Ignore
    }
  };

  const handleLoadDemo = () => {
    handleApplyPreset(APP_PRESETS[0]);
  };

  const handleExportConfig = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${config.appName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_apk_config.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          setLocalConfig(parsed);
          localStorage.setItem('web2apk_config', JSON.stringify(parsed));
        } catch {
          alert('Invalid JSON configuration file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const startBuildApk = async () => {
    setIsBuildModalOpen(true);
    setIsBuilding(true);
    setBuildProgress(15);
    setBuildError(null);
    setBuildResult(null);

    // Simulate animated incremental progress
    const progressInterval = setInterval(() => {
      setBuildProgress((prev) => {
        if (prev >= 85) {
          clearInterval(progressInterval);
          return 85;
        }
        return prev + Math.floor(Math.random() * 15) + 8;
      });
    }, 350);

    try {
      const response = await fetch('/api/build-apk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      const data = await response.json();
      clearInterval(progressInterval);

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to compile APK package');
      }

      setBuildProgress(100);
      setBuildResult(data);
      setIsBuilding(false);
    } catch (err: unknown) {
      clearInterval(progressInterval);
      setIsBuilding(false);
      setBuildError(err instanceof Error ? err.message : 'Unknown compilation error occurred');
    }
  };

  const tabs = [
    { id: 'general', label: '1. URL & Info', icon: Globe },
    { id: 'permissions', label: '2. Permissions', icon: Shield },
    { id: 'branding', label: '3. Icon & Splash', icon: Palette },
    { id: 'webview', label: '4. Native Engine', icon: Sliders },
  ];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased">
      {/* Top Navigation */}
      <Navbar
        config={config}
        onOpenPresets={() => setIsPresetsOpen(true)}
        onLoadDemo={handleLoadDemo}
        onExportConfig={handleExportConfig}
        onImportConfig={handleImportConfig}
        onBuildApk={startBuildApk}
        isBuilding={isBuilding}
      />

      {/* Main Workspace */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left Column: Form & Tabs */}
          <div className="space-y-6 lg:col-span-7">
            {/* Step Navigation Tabs */}
            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-200/70 p-1.5 sm:grid-cols-4 shadow-inner">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    id={`tab-btn-${tab.id}`}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-3 text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-md'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Panels */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7">
              {activeTab === 'general' && (
                <GeneralSettings config={config} onChange={updateConfig} />
              )}

              {activeTab === 'permissions' && (
                <PermissionsSection
                  permissions={config.permissions}
                  onChange={(permissions) => updateConfig({ permissions })}
                />
              )}

              {activeTab === 'branding' && (
                <BrandingCustomizer
                  branding={config.branding}
                  styling={config.styling}
                  appName={config.appName}
                  onBrandingChange={(brandingUpdates) =>
                    updateConfig({ branding: { ...config.branding, ...brandingUpdates } })
                  }
                  onStylingChange={(stylingUpdates) =>
                    updateConfig({ styling: { ...config.styling, ...stylingUpdates } })
                  }
                />
              )}

              {activeTab === 'webview' && (
                <WebViewControls
                  webView={config.webView}
                  styling={config.styling}
                  onWebViewChange={(webViewUpdates) =>
                    updateConfig({ webView: { ...config.webView, ...webViewUpdates } })
                  }
                  onStylingChange={(stylingUpdates) =>
                    updateConfig({ styling: { ...config.styling, ...stylingUpdates } })
                  }
                />
              )}

              {/* Bottom Next/Previous Step Row */}
              <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
                {activeTab !== 'general' ? (
                  <button
                    type="button"
                    onClick={() => {
                      const currentIdx = TAB_ORDER.indexOf(activeTab);
                      if (currentIdx > 0) setActiveTab(TAB_ORDER[currentIdx - 1]);
                    }}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    ← Previous Step
                  </button>
                ) : <div />}

                {activeTab !== 'webview' ? (
                  <button
                    type="button"
                    onClick={() => {
                      const currentIdx = TAB_ORDER.indexOf(activeTab);
                      if (currentIdx < TAB_ORDER.length - 1) setActiveTab(TAB_ORDER[currentIdx + 1]);
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-800"
                  >
                    Next Step <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={startBuildApk}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:from-emerald-500 hover:to-teal-500"
                  >
                    <Sparkles className="h-4 w-4" /> Build Ready APK
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Live Phone Simulator */}
          <div className="lg:col-span-5">
            <div className="sticky top-20 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Live Device Simulation</h3>
                  <p className="text-[11px] text-slate-500">Interactive Android viewport</p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Live Sync
                </div>
              </div>

              <PhoneSimulator config={config} />
            </div>
          </div>
        </div>
      </main>

      {/* Presets / Templates Modal */}
      <PresetsModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectPreset={handleApplyPreset}
        currentAppName={config.appName}
      />

      {/* Build & Compilation Modal */}
      <BuildProgressModal
        isOpen={isBuildModalOpen}
        onClose={() => setIsBuildModalOpen(false)}
        isBuilding={isBuilding}
        progress={buildProgress}
        buildResult={buildResult}
        error={buildError}
      />
    </div>
  );
}
