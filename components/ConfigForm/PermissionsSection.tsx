'use client';

import React from 'react';
import {
  Camera,
  FolderArchive,
  Download,
  MapPin,
  Mic,
  Bell,
  Activity,
  Wifi,
  Lock,
  Fingerprint,
  Bluetooth,
  ShieldCheck,
  CheckCheck,
  XCircle,
} from 'lucide-react';
import { AppConfig, AppPermissions } from '@/types/app-config';

interface PermissionsSectionProps {
  permissions: AppPermissions;
  onChange: (updated: AppPermissions) => void;
}

interface PermissionItem {
  key: keyof AppPermissions;
  label: string;
  category: 'media' | 'storage' | 'location' | 'system';
  androidTag: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const PermissionsSection: React.FC<PermissionsSectionProps> = ({
  permissions,
  onChange,
}) => {
  const items: PermissionItem[] = [
    // Media
    {
      key: 'camera',
      label: 'Camera Access',
      category: 'media',
      androidTag: 'android.permission.CAMERA',
      description: 'Allows website to capture photos, record video, or scan QR codes via WebView.',
      icon: Camera,
    },
    {
      key: 'recordAudio',
      label: 'Microphone & Audio',
      category: 'media',
      androidTag: 'android.permission.RECORD_AUDIO',
      description: 'Enables voice notes, speech recognition, and WebRTC audio calling.',
      icon: Mic,
    },
    {
      key: 'vibrate',
      label: 'Vibration & Haptics',
      category: 'media',
      androidTag: 'android.permission.VIBRATE',
      description: 'Allows web buttons or alerts to trigger tactile physical haptic feedback.',
      icon: Activity,
    },

    // Storage & Files
    {
      key: 'storageRead',
      label: 'Read Media & Gallery',
      category: 'storage',
      androidTag: 'android.permission.READ_MEDIA_IMAGES',
      description: 'Allows uploading photos/files from user gallery inside <input type="file">.',
      icon: FolderArchive,
    },
    {
      key: 'storageWrite',
      label: 'Save Downloads to Storage',
      category: 'storage',
      androidTag: 'android.permission.WRITE_EXTERNAL_STORAGE',
      description: 'Allows downloading receipts, PDFs, images, or documents to Downloads folder.',
      icon: Download,
    },

    // Location & Sensors
    {
      key: 'locationFine',
      label: 'Precise GPS Location',
      category: 'location',
      androidTag: 'android.permission.ACCESS_FINE_LOCATION',
      description: 'Allows high-accuracy GPS coordinates for delivery tracking, maps, and nearby stores.',
      icon: MapPin,
    },
    {
      key: 'locationCoarse',
      label: 'Approximate Network Location',
      category: 'location',
      androidTag: 'android.permission.ACCESS_COARSE_LOCATION',
      description: 'Provides city/neighborhood level location for regional content without high battery drain.',
      icon: MapPin,
    },
    {
      key: 'wakeLock',
      label: 'Keep Screen Awake (WakeLock)',
      category: 'location',
      androidTag: 'android.permission.WAKE_LOCK',
      description: 'Prevents display from dimming or turning off during video playback or active tasks.',
      icon: Lock,
    },

    // System & Security
    {
      key: 'notifications',
      label: 'Push & Post Notifications',
      category: 'system',
      androidTag: 'android.permission.POST_NOTIFICATIONS',
      description: 'Required on Android 13+ to deliver alert notifications, reminders, and order updates.',
      icon: Bell,
    },
    {
      key: 'networkState',
      label: 'Network State Monitor',
      category: 'system',
      androidTag: 'android.permission.ACCESS_NETWORK_STATE',
      description: 'Detects WiFi/cellular connection changes to automatically display offline fallback screen.',
      icon: Wifi,
    },
    {
      key: 'biometric',
      label: 'Biometric Authentication',
      category: 'system',
      androidTag: 'android.permission.USE_BIOMETRIC',
      description: 'Enables fingerprint or face unlock bridge for secure checkout or logins.',
      icon: Fingerprint,
    },
    {
      key: 'bluetooth',
      label: 'Bluetooth Connectivity',
      category: 'system',
      androidTag: 'android.permission.BLUETOOTH_CONNECT',
      description: 'Enables Web Bluetooth API to connect with IoT devices or thermal printers.',
      icon: Bluetooth,
    },
  ];

  const handleToggle = (key: keyof AppPermissions) => {
    onChange({
      ...permissions,
      [key]: !permissions[key],
    });
  };

  const handleSelectAll = (value: boolean) => {
    const updated = { ...permissions };
    for (const key of Object.keys(updated) as (keyof AppPermissions)[]) {
      updated[key] = value;
    }
    onChange(updated);
  };

  const applyEcommercePermissions = () => {
    onChange({
      ...permissions,
      camera: true,
      storageRead: true,
      storageWrite: true,
      locationFine: true,
      locationCoarse: true,
      recordAudio: false,
      notifications: true,
      vibrate: true,
      networkState: true,
      wakeLock: false,
      biometric: true,
      bluetooth: false,
    });
  };

  const activeCount = Object.values(permissions).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Device Permissions</h2>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-100">
              {activeCount} of {items.length} Active
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Selected permissions will be injected into <code className="font-mono text-xs text-slate-700">AndroidManifest.xml</code> and requested natively at runtime.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleSelectAll(true)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
          >
            <CheckCheck className="h-3.5 w-3.5 text-indigo-600" />
            Enable All
          </button>
          <button
            type="button"
            onClick={() => handleSelectAll(false)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
          >
            <XCircle className="h-3.5 w-3.5 text-slate-400" />
            Clear
          </button>
          <button
            type="button"
            onClick={applyEcommercePermissions}
            className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50/70 px-3 py-1.5 text-xs font-semibold text-indigo-800 transition hover:bg-indigo-100"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
            E-Commerce Pack
          </button>
        </div>
      </div>

      {/* Permissions Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => {
          const isEnabled = permissions[item.key];
          const Icon = item.icon;

          return (
            <div
              key={item.key}
              onClick={() => handleToggle(item.key)}
              id={`perm-card-${item.key}`}
              className={`group flex cursor-pointer items-start justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl transition ${
                isEnabled
                  ? 'border-indigo-300 bg-indigo-50/30'
                  : 'hover:border-slate-300 hover:bg-slate-100/50'
              }`}
            >
              <div className="flex items-start gap-3 pr-2">
                <div
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${
                    isEnabled
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-500 group-hover:text-slate-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-slate-900">{item.label}</div>
                  <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{item.description}</p>
                  <code className="mt-1.5 inline-block font-mono text-[10px] text-slate-500 bg-white border border-slate-200 rounded px-1.5 py-0.5">
                    {item.androidTag}
                  </code>
                </div>
              </div>

              {/* Custom Switch toggle */}
              <div className="relative mt-1 shrink-0">
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={() => {}} // Handled by container click
                  className="sr-only"
                />
                <div
                  className={`w-10 h-5 rounded-full relative transition-colors ${
                    isEnabled ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-xs ${
                      isEnabled ? 'right-1' : 'left-1'
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
