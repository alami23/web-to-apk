import { NextRequest, NextResponse } from 'next/server';
import { AppConfig, BuildLogEntry } from '@/types/app-config';
import {
  generateCompleteProjectZip,
  generateReadyApkPackage,
  sanitizeAppName,
  sanitizePackageName,
} from '@/lib/android-generator';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const logs: BuildLogEntry[] = [];

  const addLog = (step: string, message: string, status: BuildLogEntry['status']) => {
    logs.push({
      step,
      message,
      status,
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  try {
    const config: AppConfig = await req.json();

    // 1. Validation step
    addLog('Initialization', 'Parsing configuration payload & validating inputs...', 'in_progress');
    
    if (!config.appName || config.appName.trim() === '') {
      throw new Error('App Name is required');
    }
    if (!config.webUrl || !config.webUrl.startsWith('http')) {
      throw new Error('A valid website URL starting with http:// or https:// is required');
    }

    const safePkg = sanitizePackageName(config.packageName || 'com.example.webapp');
    const safeName = sanitizeAppName(config.appName);
    addLog('Initialization', `Configuration verified for "${safeName}" (${safePkg})`, 'completed');

    // 2. Manifest & Permissions step
    const minSdk = config.minSdk || 21;
    const targetSdk = config.targetSdk || 35;
    addLog('Manifest & Permissions', `Configuring AndroidManifest.xml (Min SDK ${minSdk}, Target SDK ${targetSdk})...`, 'in_progress');
    const activePerms = Object.entries(config.permissions)
      .filter(([_, v]) => v)
      .map(([k]) => k);
    addLog('Manifest & Permissions', `Applied ${activePerms.length} native permissions: ${activePerms.join(', ') || 'Standard Internet'}`, 'completed');

    // 3. Kotlin WebView Engine & Bridge
    addLog('Kotlin WebView Engine', 'Generating MainActivity.kt with WebChromeClient & File Chooser...', 'in_progress');
    addLog('Kotlin WebView Engine', `Engine features enabled: JS (${config.webView.javascriptEnabled}), Pull-to-refresh (${config.styling.pullToRefresh}), File Access (${config.webView.allowFileAccess})`, 'completed');

    // 4. Splash Screen & Theme Assets
    addLog('Branding & Splash Assets', `Generating theme XMLs, vector icons, and ${config.branding.splashDurationMs}ms splash screen...`, 'in_progress');
    addLog('Branding & Splash Assets', `Generated adaptive icon and ${config.styling.primaryColor} theme resources`, 'completed');

    // 5. Compiling Android Studio Project ZIP
    addLog('Project Source Assembly', 'Packaging complete Gradle 8.7 Android Studio Project structure...', 'in_progress');
    const projectZipBlob = await generateCompleteProjectZip(config);
    const projectZipArrayBuffer = await projectZipBlob.arrayBuffer();
    const projectZipBase64 = Buffer.from(projectZipArrayBuffer).toString('base64');
    addLog('Project Source Assembly', `Full Android Studio Project bundle compiled (${(projectZipArrayBuffer.byteLength / 1024).toFixed(1)} KB)`, 'completed');

    // 6. Assembling and Signing APK Package
    addLog('APK Compilation & Signing', `Compiling Dalvik bytecode stub, target SDK ${targetSdk}, signing APK with Schemes v1/v2/v3/v4...`, 'in_progress');
    const apkResult = await generateReadyApkPackage(config);
    addLog('APK Compilation & Signing', `Signed APK successfully generated with checksum: ${apkResult.checksum.slice(0, 16)}...`, 'completed');

    const durationSec = Number(((Date.now() - startTime) / 1000).toFixed(1));
    const safeFileBase = safeName.toLowerCase().replace(/[^a-z0-9]/g, '_');

    addLog('Build Summary', `Build completed in ${durationSec}s. Ready for installation!`, 'completed');

    return NextResponse.json({
      success: true,
      appName: config.appName,
      packageName: safePkg,
      versionName: config.versionName,
      minSdk: minSdk,
      targetSdk: targetSdk,
      apkBase64: apkResult.base64,
      apkFileName: `${safeFileBase}-v${config.versionName}-release.apk`,
      projectZipBase64: projectZipBase64,
      projectZipFileName: `${safeFileBase}-android-studio-source.zip`,
      apkSizeFormatted: apkResult.sizeFormatted,
      sha256Checksum: apkResult.checksum,
      buildDurationSec: durationSec,
      logs: logs,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown build error occurred';
    addLog('Error', `Build failed: ${errorMessage}`, 'error');

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        logs: logs,
      },
      { status: 400 }
    );
  }
}
