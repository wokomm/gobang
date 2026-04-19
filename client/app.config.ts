import { ExpoConfig, ConfigContext } from 'expo/config';

const appName = '五子棋';
const projectId = process.env.COZE_PROJECT_ID || process.env.EXPO_PUBLIC_COZE_PROJECT_ID;
const slugAppName = 'gobang';

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: appName,
    slug: slugAppName,
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/gobang-icon.png',
    scheme: 'gobang',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.gobang.app',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/gobang-icon.png',
        backgroundColor: '#DEB887',
      },
      package: 'com.gobang.app',
    },
    web: {
      bundler: 'metro',
      output: 'single',
      favicon: './assets/images/favicon.png',
    },
    extra: {
      eas: {
        projectId: '07e79e3c-eaa7-440c-ac6d-ea67c57adf2c',
      },
    },
    plugins: ['expo-build-properties'],
    experiments: {
      typedRoutes: true,
    },
  };
};
