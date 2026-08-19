export type ScreenOrientation = 'auto' | 'portrait' | 'landscape' | 'sensor_portrait';
export type StatusBarStyle = 'light' | 'dark' | 'translucent' | 'colored';
export type SplashAnimation = 'fade' | 'pulse' | 'slide_up' | 'zoom';
export type IconShape = 'circle' | 'squircle' | 'rounded' | 'square';
export type UserAgentType = 'mobile_chrome' | 'desktop' | 'custom';
export type CacheMode = 'default' | 'cache_else_network' | 'no_cache' | 'cache_only';

export interface AppPermissions {
  camera: boolean;
  storageRead: boolean;
  storageWrite: boolean;
  locationFine: boolean;
  locationCoarse: boolean;
  recordAudio: boolean;
  notifications: boolean;
  vibrate: boolean;
  networkState: boolean;
  wakeLock: boolean;
  biometric: boolean;
  bluetooth: boolean;
}

export interface AppBranding {
  iconType: 'preset' | 'upload';
  iconPresetId: string;
  iconDataUrl: string | null;
  iconBgColor: string;
  iconShape: IconShape;
  
  splashType: 'gradient' | 'solid' | 'upload';
  splashBgColor: string;
  splashGradient: string;
  splashDataUrl: string | null;
  splashDurationMs: number;
  splashAnimation: SplashAnimation;
  splashShowTitle: boolean;
  splashTagline: string;
}

export interface AppStyling {
  primaryColor: string;
  accentColor: string;
  statusBarColor: string;
  statusBarStyle: StatusBarStyle;
  navBarColor: string;
  pullToRefresh: boolean;
  showProgressBar: boolean;
  progressBarColor: string;
  exitConfirmDialog: boolean;
}

export interface AppWebViewSettings {
  javascriptEnabled: boolean;
  domStorageEnabled: boolean;
  databaseEnabled: boolean;
  cacheMode: CacheMode;
  userAgentType: UserAgentType;
  customUserAgent: string;
  allowFileAccess: boolean;
  allowDownloads: boolean;
  hardwareAccelerated: boolean;
  clearCacheOnExit: boolean;
  openExternalLinksInBrowser: boolean;
  offlinePageEnabled: boolean;
  customOfflineMessage: string;
  enableZoomControls: boolean;
  allowMixedContent: boolean;
}

export interface AppConfig {
  appName: string;
  webUrl: string;
  packageName: string;
  versionName: string;
  versionCode: number;
  minSdk: number;
  targetSdk: number;
  orientation: ScreenOrientation;
  fullscreen: boolean;
  
  permissions: AppPermissions;
  branding: AppBranding;
  styling: AppStyling;
  webView: AppWebViewSettings;
}

export interface BuildLogEntry {
  step: string;
  message: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  timestamp: string;
}

export interface BuildResult {
  success: boolean;
  apkBase64?: string;
  apkFileName?: string;
  projectZipBase64?: string;
  projectZipFileName?: string;
  apkSizeFormatted?: string;
  buildDurationSec?: number;
  sha256Checksum?: string;
  packageName: string;
  versionName: string;
  appName: string;
  minSdk?: number;
  targetSdk?: number;
  error?: string;
  logs: BuildLogEntry[];
}
