#!/bin/bash
# 五子棋 APK 构建脚本

set -e

echo "======================================"
echo "  五子棋 APK 一键构建脚本"
echo "======================================"

# 检查环境
check_env() {
    echo "检查构建环境..."
    
    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js 未安装"
        echo "请访问 https://nodejs.org 安装 Node.js 18+"
        exit 1
    fi
    echo "✓ Node.js: $(node -v)"
    
    # 检查 Java
    if ! command -v java &> /dev/null; then
        echo "❌ Java 未安装"
        echo "请安装 JDK 17+: https://adoptium.net/"
        exit 1
    fi
    echo "✓ Java: $(java -version 2>&1 | head -1)"
}

# 安装依赖
install_deps() {
    echo ""
    echo "安装项目依赖..."
    pnpm install
}

# 生成原生项目
prebuild_android() {
    echo ""
    echo "生成 Android 原生项目..."
    cd client
    npx expo prebuild --platform android --clean
    cd ..
}

# 构建 APK
build_apk() {
    echo ""
    echo "构建 APK..."
    cd android
    
    # 设置 Gradle 内存
    export GRADLE_OPTS="-Xmx4g -XX:MaxMetaspaceSize=1g"
    
    # 构建 Release APK（包含 JS Bundle，无需 Metro）
    ./gradlew assembleRelease --no-daemon
    
    cd ..
    
    # 复制 APK 到根目录
    cp android/app/build/outputs/apk/release/app-release.apk ./gobang.apk
    echo ""
    echo "======================================"
    echo "  ✅ 构建成功！"
    echo "======================================"
    echo "APK 位置: ./gobang.apk"
    echo ""
    echo "安装方式："
    echo "1. 将 gobang.apk 传到手机"
    echo "2. 在手机上点击安装"
    echo "3. 如提示需要信任，在设置中开启"
}

# 主流程
main() {
    check_env
    install_deps
    prebuild_android
    build_apk
}

main "$@"
