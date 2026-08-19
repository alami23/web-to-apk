'use client';

import React from 'react';
import { Smartphone, Sparkles, Download, Layers, Play, FileJson, UploadCloud } from 'lucide-react';
import { AppConfig } from '@/types/app-config';

interface NavbarProps {
  config: AppConfig;
  onOpenPresets: () => void;
  onLoadDemo: () => void;
  onExportConfig: () => void;
  onImportConfig: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBuildApk: () => void;
  isBuilding: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenPresets,
  onLoadDemo,
  onExportConfig,
  onImportConfig,
  onBuildApk,
  isBuilding,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="flex w-full h-16 items-center justify-between px-4 sm:px-8 lg:px-10">
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-xs">
            <Smartphone className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-xl tracking-tight text-slate-900">AppForge</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Android 16 Ready
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            id="btn-templates"
            type="button"
            onClick={onOpenPresets}
            className="hidden items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors md:inline-flex"
          >
            <Layers className="h-4 w-4" />
            Templates
          </button>

          <button
            id="btn-load-demo"
            type="button"
            onClick={onLoadDemo}
            className="hidden items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors sm:inline-flex"
          >
            <Play className="h-3.5 w-3.5" />
            Load Sample
          </button>

          {/* Config Export / Import */}
          <div className="flex items-center space-x-1 border-x border-slate-200 px-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={onImportConfig}
              className="hidden"
            />
            <button
              id="btn-import-config"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Import configuration JSON"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            >
              <UploadCloud className="h-4 w-4" />
            </button>
            <button
              id="btn-export-config"
              type="button"
              onClick={onExportConfig}
              title="Export configuration JSON"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            >
              <FileJson className="h-4 w-4" />
            </button>
          </div>

          {/* Main Build Action */}
          <button
            id="btn-build-apk-nav"
            type="button"
            onClick={onBuildApk}
            disabled={isBuilding}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-indigo-700 transition-colors text-sm shadow-sm disabled:opacity-50"
          >
            {isBuilding ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Building APK...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Compile APK</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
