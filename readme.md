<div align="center">

# Universal Longshot Pro 🚀

[English](#english) | [中文](#中文) | [日本語](#日本語) | [Español](#español)

---

</div>

---

<a id="english"></a>

# Universal Longshot Pro 🚀

A highly optimized, high-privilege Chrome Extension (Manifest V3) designed to capture perfect, full-page long screenshots on complex modern web applications (like X/Twitter, single-page apps, and heavy React-based sites) without breaking the page or encountering black screens.

---

## 🌟 Why This Exists (Key Features)

Traditional screenshot extensions often crash on modern frameworks or generate broken, repeating images. **Universal Longshot Pro** solves these "impossible" extension development edge-cases natively:

* **⚡ 0-Conflict with React 18 (Fixes Error #418 / #422):** Instead of injecting clumsy DOM elements into the host webpage and crashing the React Virtual DOM/Hydration process, this tool runs entirely inside an isolated background sandbox and a clean native browser Popup.
* **🛡️ 100% CSP & Sandbox Bypass (Anti-Black Screen):** Bypasses strict Content Security Policies (CSP) by capturing fragments in the high-privilege `background.js` Service Worker layer. Canvas rendering is completely sandboxed, eliminating `net::ERR_FAILED` or blacked-out canvas images.
* **✨ Intelligent Sticky & Banner Purification:** Automatically retains the webpage's original beautiful header on the first frame, then seamlessly hides all fixed/sticky elements (`position: fixed` / `position: sticky`) during manual scrolling. No more ugly, repeated "shutter blind" banner stripes!
* **📸 Static Radar Smart Capture (Anti-Shutter Lag):** Adapts completely to your personal manual scrolling pace. A high-frequency (100ms) detection algorithm captures a fragment *only when the page stops moving and completely finishes rendering*, guaranteeing zero pixel misalignment or white gaps.

---

## 📂 Project Structure

```text
universal-longshot/
├── manifest.json       # Extension configuration & activeTab/scripting permissions
├── popup.html          # Clean floating control interface
├── popup.js            # Frontend messenger for starting/stopping sessions
└── background.js       # The Core Brain: handles scroll monitoring, sticky hiding, and stitching
```

## 🛠️ Installation Guide (Developer Mode)

Since this project is open-source, you can easily load it into your browser locally:

1. **Download/Clone** this repository to your local machine.
2. Open your Google Chrome browser and navigate to `chrome://extensions/`.
3. Enable **"Developer mode"** using the toggle switch in the top-right corner.
4. Click the **"Load unpacked"** button in the top-left corner.
5. Select the `universal-longshot` folder containing the `manifest.json` file.
6. (Optional) For best experience, click the Extensions "puzzle piece" icon in the Chrome toolbar and pin **Universal Longshot Pro**.

---

## 🎮 How to Use It Perfectly

1. Navigate to any website (e.g., Twitter/X) and refresh the page (F5) after your first extension installation.
2. Click the **Universal Longshot Pro** icon in your browser toolbar.
3. Click the blue **Start Capturing** button.
4. Manually scroll down the webpage at your own comfortable pace.
   > **Tip:** Pause for half a second after each scroll to let the static radar capture a crisp, fully rendered fragment.
5. Once you have scrolled through the content you want, click the extension icon again and click the red **Stop & Save Image** button.
6. Your high-definition, seamlessly stitched `.png` long screenshot will download automatically!

---

## ⚙️ Technical Architecture Under the Hood

```
[ Webpage DOM ] <--- Completely Untouched (No React crashes!)
       ^
       | Isolated scripting execution (visibility: hidden)
       v
 [ popup.html/js ] ---> Signals ---> [ background.js (Service Worker) ]
                                              |
                                              |---> chrome.tabs.captureVisibleTab
                                              |---> 100ms Static Drift Radar
                                              v
                                    [ Sandboxed Canvas Stitcher ]
                                              |
                                              v (White basecoat applied)
                                    [ Safe Local Image Download ]
```

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## ⚠️ Disclaimer

This extension is provided "as is", without warranty of any kind, express or implied. Use it at your own risk. The authors are not liable for any damages or data loss arising from its use. This tool is intended for personal, non-commercial use only. Users are responsible for complying with the terms of service of websites they capture. No data is collected, stored, or transmitted by this extension.

---

<a id="中文"></a>

# Universal Longshot Pro 🚀

一款高度优化、高权限的 Chrome 扩展程序（Manifest V3），专为复杂现代 Web 应用（如 X/Twitter、单页应用和重度 React 网站）设计，能够完美捕获全页面长截图，不会破坏页面或出现黑屏。

---

## 🌟 为什么存在（核心特性）

传统截图扩展程序常常在现代框架上崩溃，或生成破损、重复的图像。**Universal Longshot Pro** 原生解决了这些"不可能"的扩展开发边缘情况：

* **⚡ 与 React 18 零冲突（修复 Error #418 / #422）：** 无需向宿主网页注入笨重的 DOM 元素，不会破坏 React 虚拟 DOM/水合过程。本工具完全在隔离的后台沙箱和干净的浏览器原生弹窗中运行。
* **🛡️ 100% CSP 与沙箱绕过（防黑屏）：** 通过在高权限的 `background.js` Service Worker 层捕获片段来绕过严格的内容安全策略（CSP）。Canvas 渲染完全沙箱化，彻底消除 `net::ERR_FAILED` 或画布黑屏问题。
* **✨ 智能粘性与横幅净化：** 自动在第一帧保留网页原有的精美页头，然后在手动滚动期间无缝隐藏所有固定/粘性元素（`position: fixed` / `position: sticky`）。不再有丑陋、重复的"百叶窗"横幅条纹！
* **📸 静态雷达智能捕获（防快门延迟）：** 完全适应您的个人手动滚动节奏。高频（100ms）检测算法仅在页面停止移动并完全完成渲染时捕获片段，保证零像素错位或白色间隙。

---

## 📂 项目结构

```text
universal-longshot/
├── manifest.json       # 扩展配置和 activeTab/scripting 权限
├── popup.html          # 简洁的浮动控制界面
├── popup.js            # 用于开始/停止会话的前端信使
└── background.js       # 核心大脑：处理滚动监控、粘性元素隐藏和图像拼接
```

## 🛠️ 安装指南（开发者模式）

由于本项目是开源的，您可以轻松地将其加载到浏览器中：

1. **下载/克隆** 此仓库到您的本地机器。
2. 打开 Google Chrome 浏览器，访问 `chrome://extensions/`。
3. 在右上角打开 **"开发者模式"** 开关。
4. 点击左上角的 **"加载已解压的扩展程序"** 按钮。
5. 选择包含 `manifest.json` 文件的 `universal-longshot` 文件夹。
6. （可选）为获得最佳体验，点击 Chrome 工具栏中的扩展程序"拼图"图标，将 **Universal Longshot Pro** 固定在工具栏上。

---

## 🎮 完美使用指南

1. 首次安装扩展后，导航到任意网站（如 Twitter/X）并按 F5 刷新页面。
2. 点击浏览器工具栏中的 **Universal Longshot Pro** 图标。
3. 点击蓝色的 **开始捕获** 按钮。
4. 按照自己舒适的速度手动向下滚动网页。
   > **提示：** 每次滚动后暂停半秒钟，让静态雷达捕获清晰、完整渲染的片段。
5. 滚动完所需内容后，再次点击扩展图标，然后点击红色的 **停止并保存图片** 按钮。
6. 您的高清无缝拼接 `.png` 长截图将自动下载！

---

## ⚙️ 底层技术架构

```
[ 网页 DOM ] <--- 完全不受干扰（不会导致 React 崩溃！）
       ^
       | 隔离脚本执行（visibility: hidden）
       v
 [ popup.html/js ] ---> 信号 ---> [ background.js (Service Worker) ]
                                           |
                                           |---> chrome.tabs.captureVisibleTab
                                           |---> 100ms 静态漂移雷达
                                           v
                                 [ 沙箱化 Canvas 拼接器 ]
                                           |
                                           v (应用白色底涂层)
                                 [ 安全的本地图片下载 ]
```

---

## 📝 许可证

基于 MIT 许可证分发。更多信息请参阅 `LICENSE` 文件。

---

## ⚠️ 免责声明

本扩展程序按"原样"提供，不提供任何明示或暗示的担保。使用风险自负。作者不对因使用本工具造成的任何损害或数据丢失承担责任。本工具仅供个人非商业用途使用。用户有责任遵守所捕获网站的服務条款。本扩展程序不会收集、存储或传输任何数据。

---

<a id="日本語"></a>

# Universal Longshot Pro 🚀

高度に最適化された高権限の Chrome 拡張機能（Manifest V3）です。複雑なモダン Web アプリケーション（X/Twitter、シングルページアプリケーション、ヘビーな React ベースのサイトなど）で、ページを壊したり黒い画面に悩まされることなく、完璧な全画面ロングスクリーンショットをキャプチャするために設計されています。

---

## 🌟 なぜこれが必要か（主な機能）

従来のスクリーンショット拡張機能は、モダンフレームワーク上でクラッシュしたり、破損した繰り返し画像を生成したりすることがよくあります。**Universal Longshot Pro** は、これらの「不可能」な拡張機能開発のエッジケースをネイティブに解決します：

* **⚡ React 18 とのゼロコンフリクト（Error #418 / #422 を修正）：** ホスト Web ページに粗雑な DOM 要素を注入して React 仮想 DOM/ハイドレーションプロセスをクラッシュさせる代わりに、このツールは完全に分離されたバックグラウンドサンドボックスとクリーンなネイティブブラウザポップアップ内で実行されます。
* **🛡️ 100% CSP およびサンドボックス回避（ブラックスクリーン防止）：** 高権限の `background.js` Service Worker レイヤーでフラグメントをキャプチャすることにより、厳格なコンテンツセキュリティポリシー（CSP）を回避します。Canvas レンダリングは完全にサンドボックス化され、`net::ERR_FAILED` や真っ黒なキャンバス画像を排除します。
* **✨ インテリジェントなスティッキー＆バナー除去：** 最初のフレームでは Web ページの元の美しいヘッダーを自動的に保持し、手動スクロール中はすべての固定/スティッキー要素（`position: fixed` / `position: sticky`）をシームレスに非表示にします。見苦しい繰り返しの「シャッター blinds」バナー縞模様とはおさらばです！
* **📸 静的レーダースマートキャプチャ（シャッターラグ防止）：** 個人の手動スクロール速度に完全に適応します。高頻度（100ms）の検出アルゴリズムが、ページが停止しレンダリングが完全に完了した場合にのみフラグメントをキャプチャし、ゼロピクセルの位置ずれや白い隙間を保証します。

---

## 📂 プロジェクト構造

```text
universal-longshot/
├── manifest.json       # 拡張機能の設定と activeTab/scripting 権限
├── popup.html          # クリーンなフローティングコントロールインターフェース
├── popup.js            # セッションの開始/停止を行うフロントエンドメッセンジャー
└── background.js       # 核となる頭脳：スクロール監視、スティッキー非表示、画像結合を処理
```

## 🛠️ インストールガイド（開発者モード）

このプロジェクトはオープンソースなので、ローカルで簡単にブラウザに読み込めます：

1. このリポジトリを**ダウンロード/クローン**してローカルマシンに配置します。
2. Google Chrome ブラウザを開き、`chrome://extensions/` にアクセスします。
3. 右上隅のトグルスイッチで**「デベロッパーモード」**を有効にします。
4. 左上隅の**「パッケージ化されていない拡張機能を読み込む」**ボタンをクリックします。
5. `manifest.json` ファイルを含む `universal-longshot` フォルダを選択します。
6. （任意）最良の体験のため、Chrome ツールバーの拡張機能「パズルピース」アイコンをクリックして、**Universal Longshot Pro** をピン留めします。

---

## 🎮 完璧に使用する方法

1. 最初の拡張機能インストール後、任意の Web サイト（Twitter/X など）に移動し、F5 でページを更新します。
2. ブラウザのツールバーにある **Universal Longshot Pro** アイコンをクリックします。
3. 青い **キャプチャ開始** ボタンをクリックします。
4. 自分の快適なペースで手動で Web ページを下にスクロールします。
   > **ヒント：** スクロールごとに 0.5 秒間停止し、静的レーダーが鮮明で完全にレンダリングされたフラグメントをキャプチャできるようにします。
5. 必要なコンテンツをスクロールし終えたら、再度拡張機能アイコンをクリックし、赤い **停止して画像を保存** ボタンをクリックします。
6. 高解像度でシームレスに結合された `.png` ロングスクリーンショットが自動的にダウンロードされます！

---

## ⚙️ 内部の技術アーキテクチャ

```
[ Webページ DOM ] <--- 完全に untouched（React クラッシュなし！）
       ^
       | 分離されたスクリプト実行（visibility: hidden）
       v
 [ popup.html/js ] ---> シグナル ---> [ background.js (Service Worker) ]
                                              |
                                              |---> chrome.tabs.captureVisibleTab
                                              |---> 100ms 静的ドリフトレーダー
                                              v
                                    [ サンドボックス化 Canvas 結合器 ]
                                              |
                                              v（白い下地を適用）
                                    [ 安全なローカル画像ダウンロード ]
```

---

## 📝 ライセンス

MIT ライセンスの下で配布されています。詳細は `LICENSE` ファイルを参照してください。

---

## ⚠️ 免責事項

本拡張機能は「現状のまま」提供され、明示または黙示を問わずいかなる保証もありません。自己責任でご使用ください。作者は本ツールの使用に起因するいかなる損害やデータ損失についても責任を負いません。本ツールは個人の非商用利用のみを目的としています。ユーザーはキャプチャするウェブサイトの利用規約を遵守する責任があります。本拡張機能はいかなるデータも収集、保存、送信しません。

---

<a id="español"></a>

# Universal Longshot Pro 🚀

Una extensión de Chrome (Manifest V3) altamente optimizada y con altos privilegios, diseñada para capturar capturas de pantalla largas de página completa perfectas en aplicaciones web modernas complejas (como X/Twitter, aplicaciones de una sola página y sitios pesados basados en React) sin romper la página ni encontrar pantallas negras.

---

## 🌟 Por Qué Existe (Características Clave)

Las extensiones de captura de pantalla tradicionales a menudo fallan en frameworks modernos o generan imágenes rotas y repetitivas. **Universal Longshot Pro** resuelve estos casos extremos "imposibles" del desarrollo de extensiones de forma nativa:

* **⚡ Conflicto Cero con React 18 (Soluciona Error #418 / #422):** En lugar de inyectar elementos DOM torpes en la página web anfitriona y bloquear el proceso del Virtual DOM/Hydration de React, esta herramienta se ejecuta completamente dentro de un sandbox de fondo aislado y un Popup nativo limpio del navegador.
* **🛡️ 100% Bypass de CSP y Sandbox (Anti-Pantalla Negra):** Evita las políticas estrictas de seguridad de contenido (CSP) capturando fragmentos en la capa de Service Worker de `background.js` con altos privilegios. El renderizado del Canvas está completamente aislado, eliminando `net::ERR_FAILED` o imágenes de canvas ennegrecidas.
* **✨ Purificación Inteligente de Sticky y Banners:** Retiene automáticamente el hermoso encabezado original de la página web en el primer fotograma, luego oculta sin problemas todos los elementos fijos/sticky (`position: fixed` / `position: sticky`) durante el desplazamiento manual. ¡No más feas franjas de banner repetidas como "persianas"!
* **📸 Captura Inteligente por Radar Estático (Anti-Retardo de Obturador):** Se adapta completamente a su ritmo de desplazamiento manual personal. Un algoritmo de detección de alta frecuencia (100ms) captura un fragmento *solo cuando la página deja de moverse y termina de renderizarse por completo*, garantizando cero desalineación de píxeles o espacios en blanco.

---

## 📂 Estructura del Proyecto

```text
universal-longshot/
├── manifest.json       # Configuración de la extensión y permisos activeTab/scripting
├── popup.html          # Interfaz de control flotante limpia
├── popup.js            # Mensajero frontend para iniciar/detener sesiones
└── background.js       # El Cerebro Principal: maneja monitoreo de scroll, ocultación sticky y costura
```

## 🛠️ Guía de Instalación (Modo Desarrollador)

Dado que este proyecto es de código abierto, puede cargarlo fácilmente en su navegador localmente:

1. **Descargue/Clone** este repositorio en su máquina local.
2. Abra su navegador Google Chrome y navegue a `chrome://extensions/`.
3. Active el **"Modo desarrollador"** usando el interruptor en la esquina superior derecha.
4. Haga clic en el botón **"Cargar extensión sin empaquetar"** en la esquina superior izquierda.
5. Seleccione la carpeta `universal-longshot` que contiene el archivo `manifest.json`.
6. (Opcional) Para una mejor experiencia, haga clic en el icono de "pieza de rompecabezas" de Extensiones en la barra de herramientas de Chrome y fije **Universal Longshot Pro**.

---

## 🎮 Cómo Usarlo Perfectamente

1. Navegue a cualquier sitio web (ej. Twitter/X) y actualice la página (F5) después de la primera instalación de la extensión.
2. Haga clic en el icono de **Universal Longshot Pro** en la barra de herramientas de su navegador.
3. Haga clic en el botón azul **Iniciar Captura**.
4. Desplácese manualmente hacia abajo por la página web a su propio ritmo cómodo.
   > **Consejo:** Haga una pausa de medio segundo después de cada desplazamiento para permitir que el radar estático capture un fragmento nítido y completamente renderizado.
5. Una vez que haya desplazado todo el contenido deseado, haga clic nuevamente en el icono de la extensión y luego en el botón rojo **Detener y Guardar Imagen**.
6. ¡Su captura de pantalla larga `.png` de alta definición y perfectamente unida se descargará automáticamente!

---

## ⚙️ Arquitectura Técnica Interna

```
[ DOM de la Página Web ] <--- Completamente Intacto (¡Sin caídas de React!)
       ^
       | Ejecución de scripting aislada (visibility: hidden)
       v
 [ popup.html/js ] ---> Señales ---> [ background.js (Service Worker) ]
                                              |
                                              |---> chrome.tabs.captureVisibleTab
                                              |---> Radar de Deriva Estática 100ms
                                              v
                                    [ Cosificador de Canvas en Sandbox ]
                                              |
                                              v (Capa base blanca aplicada)
                                    [ Descarga Segura de Imagen Local ]
```

---

## 📝 Licencia

Distribuido bajo la Licencia MIT. Consulte el archivo `LICENSE` para más información.

---

## ⚠️ Aviso Legal

Esta extensión se proporciona "tal cual", sin garantía de ningún tipo, expresa o implícita. Úsela bajo su propio riesgo. Los autores no son responsables por daños o pérdida de datos derivados de su uso. Esta herramienta está destinada únicamente para uso personal y no comercial. Los usuarios son responsables de cumplir con los términos de servicio de los sitios web que capturen. Esta extensión no recopila, almacena ni transmite ningún dato.
