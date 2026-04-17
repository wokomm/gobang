# 五子棋游戏 - 构建指南

## 方式一：在本地构建 APK（推荐）

### 前提条件
- Node.js 18+ 
- Java Development Kit (JDK) 17+
- Android Studio 或 Android SDK

### 构建步骤

1. **下载项目代码**
   ```bash
   git clone <项目仓库地址>
   cd <项目目录>
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **生成原生 Android 项目**
   ```bash
   cd client
   npx expo prebuild --platform android
   ```

4. **构建 APK**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```
   
   APK 文件将生成在: `android/app/build/outputs/apk/release/app-release.apk`

### 安装到手机

1. 将 APK 文件传输到手机
2. 在手机上打开 APK 文件
3. 如提示"安装来源受限制"，在设置中允许安装未知来源应用
4. 安装完成后打开"五子棋"应用

---

## 方式二：使用 EAS Build 云构建（无需本地配置）

1. **安装 EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **登录 Expo 账号**
   ```bash
   eas login
   ```

3. **配置构建**
   ```bash
   cd client
   eas build:configure
   ```

4. **提交云构建**
   ```bash
   eas build --platform android --profile preview
   ```

构建完成后，EAS 会提供 APK 下载链接。

---

## 方式三：Web 版本直接使用

访问应用 Web 地址：
- 在手机浏览器中打开: `http://<your-server>:5000`
- 添加到手机桌面（浏览器菜单 → 添加到主屏幕）

Web 版本无需安装，可直接使用。
