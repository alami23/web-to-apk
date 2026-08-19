'use client';

import React from 'react';
import {
  Smartphone,
  RotateCcw,
  Sparkles,
  Wifi,
  Battery,
  Shield,
  Home,
  ChevronLeft,
  Square,
  Circle,
  WifiOff,
  RefreshCw,
  Camera,
  MapPin,
  Mic,
  Bell,
  Check,
  ExternalLink,
  Layers,
  Play,
  Maximize2,
  Minimize2,
  Tv,
} from 'lucide-react';
import { AppConfig, IconShape } from '@/types/app-config';
import { PRESET_ICONS } from '@/lib/presets';

interface PhoneSimulatorProps {
  config: AppConfig;
  onSelectTab?: (tab: string) => void;
}

type SimulatorView = 'webview' | 'splash' | 'homescreen' | 'permissions' | 'offline';
type SimulatorScale = 'compact' | 'standard' | 'large';

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({ config }) => {
  const [activeView, setActiveView] = React.useState<SimulatorView>('webview');
  const [simulatorScale, setSimulatorScale] = React.useState<SimulatorScale>('standard');
  const [isSimulatedOffline, setIsSimulatedOffline] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [splashKey, setSplashKey] = React.useState(0);
  const [activePermIndex, setActivePermIndex] = React.useState(0);
  const [iframeKey, setIframeKey] = React.useState(0);
  const [iframeLoading, setIframeLoading] = React.useState(false);

  // Time state for status bar
  const [timeStr, setTimeStr] = React.useState('10:24');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setIframeLoading(true);
    setIframeKey((prev) => prev + 1);
    setTimeout(() => {
      setIsRefreshing(false);
      setIframeLoading(false);
    }, 1200);
  };

  const replaySplash = () => {
    setActiveView('splash');
    setSplashKey((prev) => prev + 1);
  };

  const getShapeClass = (shape: IconShape) => {
    switch (shape) {
      case 'circle': return 'rounded-full';
      case 'squircle': return 'rounded-2xl';
      case 'rounded': return 'rounded-xl';
      case 'square': return 'rounded-none';
      default: return 'rounded-2xl';
    }
  };

  // Active permissions for prompt simulator
  const activePermissionsList = Object.entries(config.permissions)
    .filter(([_, enabled]) => enabled)
    .map(([key]) => key);

  const currentPermission = activePermissionsList[activePermIndex] || 'camera';

  const getPermissionDetails = (perm: string) => {
    switch (perm) {
      case 'camera':
        return {
          title: 'Take pictures and record video?',
          icon: Camera,
          desc: 'Allows capturing photos for profiles or scanning QR codes in WebView.',
        };
      case 'locationFine':
      case 'locationCoarse':
        return {
          title: 'Access this device\'s location?',
          icon: MapPin,
          desc: 'Provides geolocation services for nearby listings and map routing.',
        };
      case 'recordAudio':
        return {
          title: 'Record audio?',
          icon: Mic,
          desc: 'Enables voice search, dictation, and audio messaging.',
        };
      case 'notifications':
        return {
          title: 'Send you notifications?',
          icon: Bell,
          desc: 'Keep updated with order status, alerts, and breaking news.',
        };
      default:
        return {
          title: 'Access device media & storage?',
          icon: Shield,
          desc: 'Required to upload files from your gallery and save downloads.',
        };
    }
  };

  const isLightIcons = config.styling.statusBarStyle === 'light';

  const shellDimensions =
    simulatorScale === 'compact'
      ? 'h-[630px] w-[320px]'
      : simulatorScale === 'large'
      ? 'h-[740px] w-[390px] sm:w-[410px]'
      : 'h-[680px] w-[350px] sm:w-[365px]';

  return (
    <div className="flex flex-col items-center w-full">
      {/* Simulator Mode & Scale Toolbar */}
      <div className="mb-4 flex flex-wrap items-center justify-between w-full gap-2">
        <div className="flex flex-wrap items-center gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200/60">
          <button
            type="button"
            id="sim-tab-webview"
            onClick={() => setActiveView('webview')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
              activeView === 'webview'
                ? 'bg-white text-indigo-600 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            WebView
          </button>

          <button
            type="button"
            id="sim-tab-splash"
            onClick={replaySplash}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
              activeView === 'splash'
                ? 'bg-white text-indigo-600 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Splash
          </button>

          <button
            type="button"
            id="sim-tab-homescreen"
            onClick={() => setActiveView('homescreen')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
              activeView === 'homescreen'
                ? 'bg-white text-indigo-600 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Home className="h-3.5 w-3.5" />
            Launcher
          </button>

          <button
            type="button"
            id="sim-tab-permissions"
            onClick={() => setActiveView('permissions')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
              activeView === 'permissions'
                ? 'bg-white text-indigo-600 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            Permissions
          </button>

          <button
            type="button"
            id="sim-tab-offline"
            onClick={() => {
              setActiveView('offline');
              setIsSimulatedOffline(true);
            }}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
              activeView === 'offline'
                ? 'bg-white text-indigo-600 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <WifiOff className="h-3.5 w-3.5" />
            Offline
          </button>
        </div>

        {/* Viewport Scale Selector */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200/60 text-[11px] font-semibold text-slate-600">
          <span className="px-1 text-[10px] uppercase font-bold text-slate-400">Scale</span>
          <button
            type="button"
            id="btn-scale-compact"
            onClick={() => setSimulatorScale('compact')}
            className={`px-2 py-1 rounded-lg transition ${
              simulatorScale === 'compact' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            Compact
          </button>
          <button
            type="button"
            id="btn-scale-standard"
            onClick={() => setSimulatorScale('standard')}
            className={`px-2 py-1 rounded-lg transition ${
              simulatorScale === 'standard' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            Standard
          </button>
          <button
            type="button"
            id="btn-scale-large"
            onClick={() => setSimulatorScale('large')}
            className={`px-2 py-1 rounded-lg transition ${
              simulatorScale === 'large' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            Full Size
          </button>
        </div>
      </div>

      {/* Simulator Device Shell */}
      <div className="relative mx-auto flex flex-col items-center transition-all duration-300">
        {/* Android Frame */}
        <div className={`relative ${shellDimensions} rounded-[48px] bg-slate-900 p-3 shadow-2xl ring-12 ring-slate-800/80 transition-all duration-300`}>
          {/* Hardware Buttons on sides */}
          <div className="absolute -left-3.5 top-28 h-12 w-1.5 rounded-l-md bg-slate-700" />
          <div className="absolute -left-3.5 top-44 h-12 w-1.5 rounded-l-md bg-slate-700" />
          <div className="absolute -right-3.5 top-32 h-16 w-1.5 rounded-r-md bg-slate-700" />

          {/* Screen Glass Container */}
          <div className="relative h-full w-full overflow-hidden rounded-[38px] bg-black flex flex-col justify-between">
            {/* Status Bar */}
            {!config.fullscreen && (
              <div
                className="relative z-20 flex h-7 items-center justify-between px-6 text-xs transition-colors duration-300 select-none"
                style={{
                  backgroundColor:
                    activeView === 'splash'
                      ? config.branding.splashBgColor
                      : activeView === 'homescreen'
                      ? 'transparent'
                      : config.styling.statusBarColor,
                  color: isLightIcons || activeView === 'splash' ? '#ffffff' : '#0f172a',
                }}
              >
                <span className="font-semibold text-[11px]">{timeStr}</span>

                {/* Camera Punch Hole */}
                <div className="absolute left-1/2 top-1.5 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-black ring-1 ring-white/10" />

                <div className="flex items-center gap-1.5 opacity-90">
                  <Wifi className="h-3 w-3" />
                  <Battery className="h-3.5 w-3.5" />
                </div>
              </div>
            )}

            {/* Top Loading Progress Bar */}
            {activeView === 'webview' && config.styling.showProgressBar && (
              <div className="relative z-20 h-1 w-full bg-slate-200/20">
                <div
                  className={`h-full transition-all duration-300 ${
                    iframeLoading || isRefreshing ? 'w-3/4 animate-pulse' : 'w-full opacity-0'
                  }`}
                  style={{ backgroundColor: config.styling.progressBarColor }}
                />
              </div>
            )}

            {/* Main Screen Content Viewport */}
            <div className="relative flex-1 w-full overflow-hidden bg-slate-950">
              {/* 1. WEBVIEW VIEW */}
              {activeView === 'webview' && (
                <div className="relative h-full w-full flex flex-col bg-white">
                  {/* Pull to refresh indicator simulation */}
                  {isRefreshing && config.styling.pullToRefresh && (
                    <div className="absolute top-2 inset-x-0 z-30 flex justify-center">
                      <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 shadow-md text-xs font-semibold text-slate-700">
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" style={{ color: config.styling.primaryColor }} />
                        <span>Refreshing...</span>
                      </div>
                    </div>
                  )}

                  {/* Web Frame / Content Preview */}
                  <div className="relative flex-1 w-full overflow-hidden bg-slate-100">
                    {config.webUrl ? (
                      <iframe
                        key={iframeKey}
                        src={config.webUrl.startsWith('http') ? config.webUrl : `https://${config.webUrl}`}
                        title="Android WebView Preview"
                        className="h-full w-full border-0 bg-white"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                        onError={() => setIsSimulatedOffline(true)}
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center p-6 text-center text-slate-500">
                        <Smartphone className="h-10 w-10 text-slate-400 mb-2" />
                        <span className="text-sm font-semibold">Enter a URL to preview</span>
                        <span className="text-xs text-slate-400 mt-1">Your website will load here live.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 2. SPLASH SCREEN VIEW */}
              {activeView === 'splash' && (
                <div
                  key={splashKey}
                  className="relative h-full w-full flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500"
                  style={{
                    background:
                      config.branding.splashType === 'gradient'
                        ? config.branding.splashGradient || 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
                        : config.branding.splashType === 'solid'
                        ? config.branding.splashBgColor
                        : undefined,
                    backgroundColor: config.branding.splashBgColor,
                  }}
                >
                  <div
                    className={`flex flex-col items-center transition-all ${
                      config.branding.splashAnimation === 'zoom'
                        ? 'animate-in zoom-in-75 duration-700'
                        : config.branding.splashAnimation === 'slide_up'
                        ? 'animate-in slide-in-from-bottom-10 duration-700'
                        : 'animate-in fade-in duration-700'
                    }`}
                  >
                    {/* App Logo */}
                    <div
                      className={`flex h-20 w-20 items-center justify-center shadow-xl overflow-hidden mb-4 ${getShapeClass(
                        config.branding.iconShape
                      )}`}
                      style={{ backgroundColor: config.branding.iconBgColor }}
                    >
                      {config.branding.iconType === 'upload' && config.branding.iconDataUrl ? (
                        <img
                          src={config.branding.iconDataUrl}
                          alt="Logo"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Sparkles className="h-10 w-10 text-white drop-shadow-md" />
                      )}
                    </div>

                    {config.branding.splashShowTitle && (
                      <h2 className="text-xl font-extrabold text-white tracking-tight">
                        {config.appName || 'Web App'}
                      </h2>
                    )}

                    {config.branding.splashTagline && (
                      <p className="mt-2 text-xs text-slate-300 max-w-[220px] font-medium leading-snug">
                        {config.branding.splashTagline}
                      </p>
                    )}

                    {/* Loading Spinner */}
                    <div className="mt-8 flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      <span className="text-[11px] text-white/70 font-mono">
                        {(config.branding.splashDurationMs / 1000).toFixed(1)}s load
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={replaySplash}
                    className="absolute bottom-4 flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/90 backdrop-blur-md hover:bg-white/20"
                  >
                    <RotateCcw className="h-3 w-3" /> Replay Splash
                  </button>
                </div>
              )}

              {/* 3. HOME LAUNCHER VIEW */}
              {activeView === 'homescreen' && (
                <div className="relative h-full w-full bg-gradient-to-b from-indigo-900 via-slate-900 to-black p-4 text-white flex flex-col justify-between select-none">
                  {/* Clock Widget */}
                  <div className="pt-6 text-center">
                    <div className="text-4xl font-extrabold tracking-tight">{timeStr}</div>
                    <div className="text-xs text-slate-300 font-medium">Tuesday, August 18</div>
                  </div>

                  {/* App Grid */}
                  <div className="grid grid-cols-4 gap-3.5 px-2 my-auto">
                    {/* The Generated App */}
                    <div
                      onClick={() => setActiveView('webview')}
                      className="group flex flex-col items-center cursor-pointer transform transition hover:scale-105"
                    >
                      <div
                        className={`flex h-13 w-13 items-center justify-center shadow-lg transition-transform overflow-hidden ring-2 ring-white/30 ${getShapeClass(
                          config.branding.iconShape
                        )}`}
                        style={{ backgroundColor: config.branding.iconBgColor }}
                      >
                        {config.branding.iconType === 'upload' && config.branding.iconDataUrl ? (
                          <img
                            src={config.branding.iconDataUrl}
                            alt="App Icon"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Sparkles className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <span className="mt-1.5 max-w-[64px] truncate text-[11px] font-semibold text-white text-center drop-shadow-md">
                        {config.appName || 'My App'}
                      </span>
                    </div>

                    {/* Stock Apps Mockup */}
                    {[
                      { name: 'Play Store', bg: '#0284c7', icon: Sparkles },
                      { name: 'Chrome', bg: '#ea580c', icon: Smartphone },
                      { name: 'Photos', bg: '#e11d48', icon: Camera },
                      { name: 'Maps', bg: '#10b981', icon: MapPin },
                      { name: 'Messages', bg: '#6366f1', icon: Bell },
                      { name: 'Settings', bg: '#64748b', icon: Shield },
                      { name: 'Music', bg: '#f59e0b', icon: Mic },
                    ].map((app) => (
                      <div key={app.name} className="flex flex-col items-center opacity-60">
                        <div
                          className="flex h-13 w-13 items-center justify-center rounded-2xl shadow-md text-white"
                          style={{ backgroundColor: app.bg }}
                        >
                          <app.icon className="h-6 w-6" />
                        </div>
                        <span className="mt-1.5 max-w-[64px] truncate text-[10px] text-slate-300 text-center">
                          {app.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Android Dock */}
                  <div className="rounded-3xl bg-white/10 p-2.5 backdrop-blur-md flex justify-around">
                    <div className="h-11 w-11 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-md">
                      <Smartphone className="h-5 w-5 text-white" />
                    </div>
                    <div className="h-11 w-11 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md">
                      <Bell className="h-5 w-5 text-white" />
                    </div>
                    <div className="h-11 w-11 rounded-2xl bg-amber-600 flex items-center justify-center shadow-md">
                      <Camera className="h-5 w-5 text-white" />
                    </div>
                    <div
                      onClick={() => setActiveView('webview')}
                      className={`h-11 w-11 flex items-center justify-center shadow-md cursor-pointer ${getShapeClass(
                        config.branding.iconShape
                      )}`}
                      style={{ backgroundColor: config.branding.iconBgColor }}
                    >
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
              )}

              {/* 4. PERMISSIONS PROMPT SIMULATOR */}
              {activeView === 'permissions' && (
                <div className="relative h-full w-full bg-slate-900/80 p-5 flex flex-col justify-end">
                  {/* Native Android Permission Dialog */}
                  <div className="w-full rounded-3xl bg-slate-800/95 p-5 text-white shadow-2xl border border-slate-700 animate-in slide-in-from-bottom duration-300">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
                        {React.createElement(getPermissionDetails(currentPermission).icon, {
                          className: 'h-5 w-5',
                        })}
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Permission Request
                        </span>
                        <h4 className="text-sm font-bold text-white leading-tight">
                          Allow <span className="text-indigo-400">{config.appName || 'Web App'}</span> to{' '}
                          {getPermissionDetails(currentPermission).title}
                        </h4>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                      {getPermissionDetails(currentPermission).desc}
                    </p>

                    {/* Dialog Buttons */}
                    <div className="mt-5 space-y-2">
                      <button
                        type="button"
                        onClick={() =>
                          setActivePermIndex((prev) => (prev + 1) % activePermissionsList.length)
                        }
                        className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition"
                      >
                        While using the app
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setActivePermIndex((prev) => (prev + 1) % activePermissionsList.length)
                        }
                        className="w-full rounded-xl bg-slate-700/80 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 transition"
                      >
                        Only this time
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setActivePermIndex((prev) => (prev + 1) % activePermissionsList.length)
                        }
                        className="w-full rounded-xl py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition"
                      >
                        Don&apos;t allow
                      </button>
                    </div>

                    {activePermissionsList.length > 1 && (
                      <div className="mt-3 text-center text-[10px] text-slate-400">
                        Permission {activePermIndex + 1} of {activePermissionsList.length} (Tap button to test next)
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 5. OFFLINE FALLBACK VIEW */}
              {activeView === 'offline' && (
                <div className="relative h-full w-full bg-slate-900 p-6 flex flex-col items-center justify-center text-center text-white">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500">
                    <WifiOff className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white">No Connection</h3>
                  <p className="mt-2 text-xs text-slate-400 max-w-[220px] leading-relaxed">
                    {config.webView.customOfflineMessage ||
                      'You are currently offline. Please check your internet connection and try again.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSimulatedOffline(false);
                      setActiveView('webview');
                      handleRefresh();
                    }}
                    className="mt-6 inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-lg transition"
                    style={{ backgroundColor: config.styling.primaryColor }}
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Try Again
                  </button>
                </div>
              )}
            </div>

            {/* Android Navigation Bar (Bottom) */}
            {!config.fullscreen && (
              <div
                className="relative z-20 flex h-9 items-center justify-around px-8 text-slate-400 select-none transition-colors"
                style={{
                  backgroundColor:
                    activeView === 'homescreen'
                      ? 'transparent'
                      : config.styling.navBarColor || '#000000',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    if (activeView !== 'webview') setActiveView('webview');
                    else handleRefresh();
                  }}
                  className="p-1 hover:text-white"
                  title="Back"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('homescreen')}
                  className="p-1 hover:text-white"
                  title="Home"
                >
                  <Circle className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('permissions')}
                  className="p-1 hover:text-white"
                  title="Recents"
                >
                  <Square className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick simulator toolbar */}
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 transition"
          >
            <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            Reload Web
          </button>
          <button
            type="button"
            onClick={() => setIsSimulatedOffline(!isSimulatedOffline)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium shadow-xs transition ${
              isSimulatedOffline
                ? 'border-rose-300 bg-rose-50 text-rose-700'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <WifiOff className="h-3 w-3" />
            {isSimulatedOffline ? 'Online Mode' : 'Test Offline'}
          </button>
        </div>
      </div>
    </div>
  );
};
