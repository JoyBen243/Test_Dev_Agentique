import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mudaplan.app',
  appName: 'My MudaPlan',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon',
      iconColor: '#4F46E5',
      sound: 'default',
    },
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 1500,
      backgroundColor: '#1E1B4B',
      showSpinner: false,
    },
  },
};

export default config;
