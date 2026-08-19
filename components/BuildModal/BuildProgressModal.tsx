'use client';

import React from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Download,
  Terminal,
  QrCode,
  Sparkles,
  Copy,
  Check,
  FolderArchive,
  Smartphone,
  ShieldCheck,
  Share2,
  ExternalLink,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { BuildResult } from '@/types/app-config';

interface BuildProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  isBuilding: boolean;
  progress: number;
  buildResult: BuildResult | null;
  error: string | null;
}

export const BuildProgressModal: React.FC<BuildProgressModalProps> = ({
  isOpen,
  onClose,
  isBuilding,
  progress,
  buildResult,
  error,
}) => {
  const [showLogs, setShowLogs] = React.useState(false);
  const [showInstallGuide, setShowInstallGuide] = React.useState(true);
  const [copiedLogs, setCopiedLogs] = React.useState(false);
  const [copiedChecksum, setCopiedChecksum] = React.useState(false);

  const qrUrl = React.useSyncExternalStore(
    () => () => {},
    () => (typeof window !== 'undefined' ? window.location.href : ''),
    () => ''
  );

  React.useEffect(() => {
    if (buildResult?.success && !isBuilding) {
      // Trigger festive celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#6366f1'],
      });
    }
  }, [buildResult?.success, isBuilding]);

  if (!isOpen) return null;

  const downloadApk = () => {
    if (!buildResult?.apkBase64) return;
    const byteCharacters = atob(buildResult.apkBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/vnd.android.package-archive' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = buildResult.apkFileName || 'app-release.apk';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadProjectZip = () => {
    if (!buildResult?.projectZipBase64) return;
    const byteCharacters = atob(buildResult.projectZipBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = buildResult.projectZipFileName || 'android-studio-project.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyChecksum = () => {
    if (!buildResult?.sha256Checksum) return;
    navigator.clipboard.writeText(buildResult.sha256Checksum);
    setCopiedChecksum(true);
    setTimeout(() => setCopiedChecksum(false), 2000);
  };

  const copyLogs = () => {
    if (!buildResult?.logs) return;
    const text = buildResult.logs
      .map((l) => `[${l.timestamp}] [${l.step}] ${l.message}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopiedLogs(true);
    setTimeout(() => setCopiedLogs(false), 2000);
  };

  const buildSteps = [
    'Parsing & validating configuration parameters',
    'Generating AndroidManifest.xml & permissions schema',
    'Compiling Kotlin WebView bridge & WebChromeClient',
    'Packaging adaptive vector icons & splash assets',
    'Assembling Gradle 8.5 Android Studio Project bundle',
    'Signing APK container with Android release certificate',
  ];

  const currentStepIndex = Math.min(
    Math.floor((progress / 100) * buildSteps.length),
    buildSteps.length - 1
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isBuilding}
          className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
        >
          <X className="h-5 w-5" />
        </button>

        {/* 1. COMPILATION IN PROGRESS STATE */}
        {isBuilding && (
          <div className="space-y-6 text-center py-4">
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-100 animate-pulse" />
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent shadow-lg" />
              <Smartphone className="absolute h-7 w-7 text-indigo-600" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Compiling Android Application...
              </h3>
              <p className="mt-1 text-sm text-slate-500 font-medium">
                Generating native Kotlin sources, Gradle configuration, and signed APK package
              </p>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>{buildSteps[currentStepIndex]}</span>
                <span className="font-mono text-indigo-600">{progress}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Step list */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left space-y-2">
              {buildSteps.map((step, idx) => {
                const isPast = idx < currentStepIndex || progress === 100;
                const isCurrent = idx === currentStepIndex && progress < 100;

                return (
                  <div key={step} className="flex items-center gap-2.5 text-xs">
                    {isPast ? (
                      <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0" />
                    ) : isCurrent ? (
                      <div className="h-4 w-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-slate-300 shrink-0" />
                    )}
                    <span
                      className={
                        isPast
                          ? 'text-slate-800 font-medium'
                          : isCurrent
                          ? 'text-indigo-600 font-bold'
                          : 'text-slate-400'
                      }
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. ERROR STATE */}
        {!isBuilding && error && (
          <div className="space-y-6 text-center py-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <AlertCircle className="h-8 w-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">Compilation Failed</h3>
              <p className="mt-1 text-sm text-rose-600 font-medium">{error}</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition"
            >
              Back to Configuration
            </button>
          </div>
        )}

        {/* 3. SUCCESS STATE */}
        {!isBuilding && buildResult?.success && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3.5 border-b border-slate-100 pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shadow-xs border border-indigo-100">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900">
                    APK Successfully Built!
                  </h3>
                  <span className="rounded-full bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
                    Ready to Install
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {buildResult.appName} ({buildResult.packageName}) • Built in{' '}
                  {buildResult.buildDurationSec}s
                </p>
              </div>
            </div>

            {/* Action Download Grid */}
            <div className="grid gap-3 sm:grid-cols-2">
              {/* Main APK Download */}
              <button
                id="btn-download-apk-modal"
                type="button"
                onClick={downloadApk}
                className="group flex flex-col items-start justify-between rounded-xl bg-indigo-600 p-5 text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 text-left"
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                    <Smartphone className="h-5 w-5 text-white" />
                  </div>
                  <span className="rounded-full bg-white/25 px-2.5 py-0.5 text-[10px] font-mono font-bold">
                    {buildResult.apkSizeFormatted || 'Signed APK'}
                  </span>
                </div>
                <div className="mt-4">
                  <span className="block text-sm font-bold">Download Android APK</span>
                  <span className="block text-[11px] text-indigo-100 opacity-90 truncate max-w-[200px]">
                    {buildResult.apkFileName}
                  </span>
                </div>
              </button>

              {/* Source Project ZIP Download */}
              <button
                id="btn-download-source-modal"
                type="button"
                onClick={downloadProjectZip}
                className="group flex flex-col items-start justify-between rounded-xl border-2 border-indigo-200 bg-indigo-50/50 p-5 text-slate-800 transition hover:border-indigo-300 hover:bg-indigo-50 text-left"
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
                    <FolderArchive className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-indigo-100 text-indigo-800 px-2 py-0.5 text-[10px] font-semibold">
                    ⭐ Recommended for Phones
                  </span>
                </div>
                <div className="mt-4">
                  <span className="block text-sm font-bold text-slate-900">
                    Android Studio Source (.zip)
                  </span>
                  <span className="block text-[11px] text-slate-600 truncate max-w-[240px]">
                    1-Click build & install on any physical phone
                  </span>
                </div>
              </button>
            </div>

            {/* Installation & Troubleshooting Alert */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-left space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>Android 16 / 15 Phone Installation Guide</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInstallGuide(!showInstallGuide)}
                  className="text-[11px] font-semibold text-amber-800 hover:underline"
                >
                  {showInstallGuide ? 'Hide Guide' : 'Show Guide'}
                </button>
              </div>

              {showInstallGuide && (
                <div className="space-y-2 pt-1 border-t border-amber-200/60 text-[11px] text-amber-900/90 leading-relaxed">
                  <div className="font-semibold text-amber-950">
                    Why does Android 16 show &quot;App not installed as package appears to be invalid&quot; or &quot;Problem parsing package&quot;?
                  </div>
                  <ul className="list-disc pl-4 space-y-1.5 text-slate-700">
                    <li>
                      <strong>Android 16 OS Security Check:</strong> Android 16 and Android 15 strictly require binary Dalvik bytecode (`classes.dex`), binary XML (`AXML`), and <strong>APK Signature Scheme v2/v3</strong> verification. Web browser client downloads cannot execute the native Google Android SDK toolchain (`aapt2`, `d8`, `apksigner`).
                    </li>
                    <li>
                      <strong>Recommended for Android 16:</strong> Download the <strong>Android Studio Source (.zip)</strong> above. Extract it, open in Android Studio and click <strong>Run (▶)</strong>, or run <code className="font-mono bg-white px-1 py-0.5 rounded border border-amber-200">./gradlew assembleDebug</code> and install via <code className="font-mono bg-white px-1 py-0.5 rounded border border-amber-200">adb install -r app-debug.apk</code>.
                    </li>
                    <li>
                      <strong>Instant Test Without Compiling:</strong> Scan the QR code below on your Android 16 device and tap <strong>&quot;Add to Home screen&quot;</strong> in Chrome for a full-screen native app experience instantly!
                    </li>
                    <li>
                      <strong>Allow &quot;Install unknown apps&quot;:</strong> On Android 16, go to <em>Settings &gt; Apps &gt; Special App Access &gt; Install Unknown Apps</em> and allow your File Manager or Browser.
                    </li>
                    <li>
                      <strong>Google Play Protect:</strong> When prompted with &quot;Blocked by Play Protect&quot;, tap <em>&quot;More details&quot; &gt; &quot;Install anyway&quot;</em>.
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* QR Code and Quick Install instructions */}
            <div className="flex flex-col sm:flex-row items-center gap-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="rounded-xl bg-white p-3 shadow-xs ring-1 ring-slate-200 shrink-0">
                <QRCodeSVG
                  value={qrUrl || 'https://ais-pre.example.com'}
                  size={100}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <div className="space-y-1.5 text-left">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <QrCode className="h-4 w-4 text-indigo-600" />
                  Instant Test on Android 16 Device
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Scan this QR code with your Android 16 camera to open the live web app in Chrome, then tap <strong>&quot;Add to Home Screen&quot;</strong> to get an instant full-screen app icon on your device with no APK sideloading required!
                </p>
                <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-500">
                  <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Target SDK {buildResult?.targetSdk || 35} • Min SDK {buildResult?.minSdk || 21} • APK Signature Schemes v1/v2/v3/v4</span>
                </div>
              </div>
            </div>

            {/* Build Specifications Card */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-semibold">Application ID:</span>
                <span className="font-mono text-[11px] font-bold text-slate-900">
                  {buildResult.packageName}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-semibold">Version Name:</span>
                <span className="font-mono text-[11px] text-slate-900">
                  {buildResult.versionName}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-semibold">Target SDK & Compatibility:</span>
                <span className="text-[11px] font-mono text-slate-900 font-semibold">
                  API {buildResult.targetSdk || 35} (Min: API {buildResult.minSdk || 21}+) • Gradle 8.7
                </span>
              </div>
              {buildResult.sha256Checksum && (
                <div className="flex items-center justify-between text-slate-700 pt-1 border-t border-slate-200">
                  <span className="font-semibold">SHA-256 Checksum:</span>
                  <button
                    type="button"
                    onClick={copyChecksum}
                    className="flex items-center gap-1 font-mono text-[10px] text-indigo-600 hover:underline"
                  >
                    {buildResult.sha256Checksum.slice(0, 18)}...
                    {copiedChecksum ? (
                      <Check className="h-3 w-3 text-indigo-600" />
                    ) : (
                      <Copy className="h-3 w-3 text-slate-400" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Logs Viewer Accordion */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowLogs(!showLogs)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
              >
                <Terminal className="h-3.5 w-3.5 text-indigo-600" />
                {showLogs ? 'Hide Build Logs' : 'View Detailed Compilation Logs'}
              </button>

              {showLogs && (
                <div className="relative rounded-xl bg-slate-900 p-4 font-mono text-[11px] text-slate-200 shadow-inner">
                  <button
                    type="button"
                    onClick={copyLogs}
                    className="absolute right-3 top-3 flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-[10px] text-slate-300 hover:bg-slate-700"
                  >
                    {copiedLogs ? (
                      <>
                        <Check className="h-3 w-3 text-indigo-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" /> Copy Logs
                      </>
                    )}
                  </button>
                  <div className="max-h-48 overflow-y-auto space-y-1 pr-2">
                    {buildResult.logs?.map((l, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="text-slate-500">[{l.timestamp}]</span>
                        <span className="text-indigo-400">[{l.step}]</span>
                        <span className="text-slate-300">{l.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
