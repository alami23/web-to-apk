'use client';

import React from 'react';
import {
  RotateCw,
  Sliders,
  WifiOff,
  FolderUp,
  DownloadCloud,
  ExternalLink,
  Code2,
  Database,
  Layers,
  Smartphone,
  ShieldAlert,
  ZoomIn,
} from 'lucide-react';
import { AppStyling, AppWebViewSettings, CacheMode, UserAgentType } from '@/types/app-config';

interface WebViewControlsProps {
  webView: AppWebViewSettings;
  styling: AppStyling;
  onWebViewChange: (updated: Partial<AppWebViewSettings>) => void;
  onStylingChange: (updated: Partial<AppStyling>) => void;
}

export const WebViewControls: React.FC<WebViewControlsProps> = ({
  webView,
  styling,
  onWebViewChange,
  onStylingChange,
}) => {
  const cacheModes: { id: CacheMode; label: string; desc: string }[] = [
    { id: 'default', label: 'Default (Standard Web)', desc: 'Respects HTTP cache headers from server' },
    { id: 'cache_else_network', label: 'Cache Else Network (Fast)', desc: 'Uses cache first, revalidates when expired' },
    { id: 'no_cache', label: 'No Cache (Always Fresh)', desc: 'Forces re-fetching from network every load' },
    { id: 'cache_only', label: 'Cache Only (Offline First)', desc: 'Does not load from network if cache exists' },
  ];

  const userAgentOptions: { id: UserAgentType; label: string; desc: string }[] = [
    { id: 'mobile_chrome', label: 'Mobile Chrome (Recommended)', desc: 'Standard Android mobile browser UA' },
    { id: 'desktop', label: 'Desktop Mode', desc: 'Forces websites to render full desktop version' },
    { id: 'custom', label: 'Custom User-Agent', desc: 'Inject custom UA header string' },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900">Advanced WebView & Native Engine</h2>
        <p className="text-sm text-slate-500">
          Fine-tune the Android Chromium WebView engine, caching policies, file chooser, and gesture controls.
        </p>
      </div>

      {/* Interactive Feature Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Hardware Acceleration */}
        <label className="flex cursor-pointer items-start justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl transition hover:border-slate-300 hover:bg-slate-100/50">
          <div className="flex items-start gap-3 pr-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-sm font-semibold text-slate-900">GPU Hardware Acceleration</span>
              <span className="block text-xs text-slate-500 leading-relaxed">
                Enables native OpenGL/Vulkan rendering pipeline for smooth 60fps animations, WebGL, and video playback.
              </span>
            </div>
          </div>
          <div className="relative mt-1 shrink-0">
            <input
              id="toggle-hardware-acceleration"
              type="checkbox"
              checked={webView.hardwareAccelerated}
              onChange={(e) => onWebViewChange({ hardwareAccelerated: e.target.checked })}
              className="sr-only"
            />
            <div
              className={`w-10 h-5 rounded-full relative transition-colors ${
                webView.hardwareAccelerated ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <div
                className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-xs ${
                  webView.hardwareAccelerated ? 'right-1' : 'left-1'
                }`}
              />
            </div>
          </div>
        </label>

        {/* Pull to Refresh */}
        <label className="flex cursor-pointer items-start justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl transition hover:border-slate-300 hover:bg-slate-100/50">
          <div className="flex items-start gap-3 pr-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <RotateCw className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-sm font-semibold text-slate-900">Pull-to-Refresh Gesture</span>
              <span className="block text-xs text-slate-500 leading-relaxed">
                Allows users to pull down at the top of the page to refresh web content.
              </span>
            </div>
          </div>
          <div className="relative mt-1 shrink-0">
            <input
              id="toggle-pull-refresh"
              type="checkbox"
              checked={styling.pullToRefresh}
              onChange={(e) => onStylingChange({ pullToRefresh: e.target.checked })}
              className="sr-only"
            />
            <div
              className={`w-10 h-5 rounded-full relative transition-colors ${
                styling.pullToRefresh ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <div
                className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-xs ${
                  styling.pullToRefresh ? 'right-1' : 'left-1'
                }`}
              />
            </div>
          </div>
        </label>

        {/* Loading Progress Bar */}
        <label className="flex cursor-pointer items-start justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl transition hover:border-slate-300 hover:bg-slate-100/50">
          <div className="flex items-start gap-3 pr-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Sliders className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-sm font-semibold text-slate-900">Top Loading Progress Bar</span>
              <span className="block text-xs text-slate-500 leading-relaxed">
                Smooth horizontal line showing page load progress (0% to 100%).
              </span>
            </div>
          </div>
          <div className="relative mt-1 shrink-0">
            <input
              id="toggle-progress-bar"
              type="checkbox"
              checked={styling.showProgressBar}
              onChange={(e) => onStylingChange({ showProgressBar: e.target.checked })}
              className="sr-only"
            />
            <div
              className={`w-10 h-5 rounded-full relative transition-colors ${
                styling.showProgressBar ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <div
                className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-xs ${
                  styling.showProgressBar ? 'right-1' : 'left-1'
                }`}
              />
            </div>
          </div>
        </label>

        {/* Zoom Controls */}
        <label className="flex cursor-pointer items-start justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl transition hover:border-slate-300 hover:bg-slate-100/50">
          <div className="flex items-start gap-3 pr-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <ZoomIn className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-sm font-semibold text-slate-900">Pinch-to-Zoom Gestures</span>
              <span className="block text-xs text-slate-500 leading-relaxed">
                Enable multi-touch pinch zooming for detailed web content and documents.
              </span>
            </div>
          </div>
          <div className="relative mt-1 shrink-0">
            <input
              id="toggle-zoom"
              type="checkbox"
              checked={webView.enableZoomControls}
              onChange={(e) => onWebViewChange({ enableZoomControls: e.target.checked })}
              className="sr-only"
            />
            <div
              className={`w-10 h-5 rounded-full relative transition-colors ${
                webView.enableZoomControls ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <div
                className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-xs ${
                  webView.enableZoomControls ? 'right-1' : 'left-1'
                }`}
              />
            </div>
          </div>
        </label>

        {/* File Chooser (Camera/Gallery Uploads) */}
        <label className="flex cursor-pointer items-start justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl transition hover:border-slate-300 hover:bg-slate-100/50">
          <div className="flex items-start gap-3 pr-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <FolderUp className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-sm font-semibold text-slate-900">Native File Chooser Bridge</span>
              <span className="block text-xs text-slate-500 leading-relaxed">
                Connects HTML <code className="font-mono text-[10px] bg-white px-1 py-0.5 rounded border border-slate-200">&lt;input type=&quot;file&quot;&gt;</code> to Android camera and gallery.
              </span>
            </div>
          </div>
          <div className="relative mt-1 shrink-0">
            <input
              id="toggle-file-access"
              type="checkbox"
              checked={webView.allowFileAccess}
              onChange={(e) => onWebViewChange({ allowFileAccess: e.target.checked })}
              className="sr-only"
            />
            <div
              className={`w-10 h-5 rounded-full relative transition-colors ${
                webView.allowFileAccess ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <div
                className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-xs ${
                  webView.allowFileAccess ? 'right-1' : 'left-1'
                }`}
              />
            </div>
          </div>
        </label>

        {/* Native Download Manager */}
        <label className="flex cursor-pointer items-start justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl transition hover:border-slate-300 hover:bg-slate-100/50">
          <div className="flex items-start gap-3 pr-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
              <DownloadCloud className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-sm font-semibold text-slate-900">Automatic Download Manager</span>
              <span className="block text-xs text-slate-500 leading-relaxed">
                Handles PDF, ZIP, and invoice downloads using Android system DownloadManager.
              </span>
            </div>
          </div>
          <div className="relative mt-1 shrink-0">
            <input
              id="toggle-downloads"
              type="checkbox"
              checked={webView.allowDownloads}
              onChange={(e) => onWebViewChange({ allowDownloads: e.target.checked })}
              className="sr-only"
            />
            <div
              className={`w-10 h-5 rounded-full relative transition-colors ${
                webView.allowDownloads ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <div
                className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-xs ${
                  webView.allowDownloads ? 'right-1' : 'left-1'
                }`}
              />
            </div>
          </div>
        </label>

        {/* Open External Links in Browser */}
        <label className="flex cursor-pointer items-start justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl transition hover:border-slate-300 hover:bg-slate-100/50">
          <div className="flex items-start gap-3 pr-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <ExternalLink className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-sm font-semibold text-slate-900">External Links in Browser</span>
              <span className="block text-xs text-slate-500 leading-relaxed">
                Third-party links (like external payment gateways) open in native Chrome.
              </span>
            </div>
          </div>
          <div className="relative mt-1 shrink-0">
            <input
              id="toggle-external-browser"
              type="checkbox"
              checked={webView.openExternalLinksInBrowser}
              onChange={(e) => onWebViewChange({ openExternalLinksInBrowser: e.target.checked })}
              className="sr-only"
            />
            <div
              className={`w-10 h-5 rounded-full relative transition-colors ${
                webView.openExternalLinksInBrowser ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <div
                className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-xs ${
                  webView.openExternalLinksInBrowser ? 'right-1' : 'left-1'
                }`}
              />
            </div>
          </div>
        </label>

        {/* Exit Confirmation Dialog */}
        <label className="flex cursor-pointer items-start justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl transition hover:border-slate-300 hover:bg-slate-100/50">
          <div className="flex items-start gap-3 pr-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-sm font-semibold text-slate-900">&quot;Press Back to Exit&quot; Toast</span>
              <span className="block text-xs text-slate-500 leading-relaxed">
                Prevents accidental app closure when user presses the Android back button.
              </span>
            </div>
          </div>
          <div className="relative mt-1 shrink-0">
            <input
              id="toggle-exit-dialog"
              type="checkbox"
              checked={styling.exitConfirmDialog}
              onChange={(e) => onStylingChange({ exitConfirmDialog: e.target.checked })}
              className="sr-only"
            />
            <div
              className={`w-10 h-5 rounded-full relative transition-colors ${
                styling.exitConfirmDialog ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <div
                className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-xs ${
                  styling.exitConfirmDialog ? 'right-1' : 'left-1'
                }`}
              />
            </div>
          </div>
        </label>
      </div>

      {/* Offline Mode Customization */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-semibold text-slate-900">Native Offline Fallback Screen</span>
          </div>
          <input
            type="checkbox"
            checked={webView.offlinePageEnabled}
            onChange={(e) => onWebViewChange({ offlinePageEnabled: e.target.checked })}
            className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
          />
        </div>
        <p className="text-xs text-slate-500">
          When the user loses internet connection, the app will show a friendly native offline page instead of a broken browser error.
        </p>
        {webView.offlinePageEnabled && (
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Custom Offline Message</label>
            <textarea
              rows={2}
              value={webView.customOfflineMessage}
              onChange={(e) => onWebViewChange({ customOfflineMessage: e.target.value })}
              placeholder="e.g. Please check your WiFi or mobile network and try again."
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs text-slate-900 outline-none transition-all"
            />
          </div>
        )}
      </div>

      {/* Cache Policy & User Agent */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Cache Mode */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            WebView Cache Strategy
          </label>
          <div className="space-y-2">
            {cacheModes.map((cm) => (
              <label
                key={cm.id}
                className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-2.5 text-xs transition ${
                  webView.cacheMode === cm.id
                    ? 'border-indigo-600 bg-indigo-50/70 font-semibold text-indigo-900 ring-1 ring-indigo-500/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="cacheMode"
                  checked={webView.cacheMode === cm.id}
                  onChange={() => onWebViewChange({ cacheMode: cm.id })}
                  className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="block text-xs font-semibold">{cm.label}</span>
                  <span className="block text-[10px] text-slate-500 font-normal">{cm.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* User-Agent Mode */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            User-Agent Identification
          </label>
          <div className="space-y-2">
            {userAgentOptions.map((ua) => (
              <label
                key={ua.id}
                className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-2.5 text-xs transition ${
                  webView.userAgentType === ua.id
                    ? 'border-indigo-600 bg-indigo-50/70 font-semibold text-indigo-900 ring-1 ring-indigo-500/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="userAgentType"
                  checked={webView.userAgentType === ua.id}
                  onChange={() => onWebViewChange({ userAgentType: ua.id })}
                  className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="block text-xs font-semibold">{ua.label}</span>
                  <span className="block text-[10px] text-slate-500 font-normal">{ua.desc}</span>
                </div>
              </label>
            ))}
          </div>

          {webView.userAgentType === 'custom' && (
            <div className="pt-1">
              <input
                type="text"
                value={webView.customUserAgent}
                onChange={(e) => onWebViewChange({ customUserAgent: e.target.value })}
                placeholder="Mozilla/5.0 (Linux; Android 14; Pixel 8) ..."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-[11px] text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
