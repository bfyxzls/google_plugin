# 项目结构
在开发Chrome插件时，以下几个文件的作用如下：

1. **manifest.json**：这是Chrome插件的清单文件，用于配置插件的基本信息、权限、页面跳转等。其中包括插件的名称、版本号、图标、后台脚本、浏览器动作等信息。

2. **background.js**：这是Chrome插件的后台脚本文件，用于处理插件的后台逻辑。可以监听事件、与浏览器进行交互、执行一些后台任务等。在manifest.json中指定了background脚本后，它会在插件加载时自动运行。

3. **popup.html**：这是Chrome插件点击后弹出的界面的HTML文件。可以定义插件弹出页面的结构、样式和交互逻辑。

4. **popup.js**：这是Chrome插件弹出页面的JavaScript文件，用于定义插件弹出页面的交互逻辑。在popup.html中引入popup.js，可以实现点击插件按钮后弹出页面的功能。

以上文件各自承担不同的角色，在Chrome插件开发中起着重要的作用。合理地编写和组织这些文件可以帮助你实现所需的功能并提升用户体验。希望这些解释对你有所帮助。

# manifest.json(v2版本)
```json
{
  "manifest_version": 2,
  "name": "lind-kc",
  "version": "1.0.1",
  "description": "lind-kc-pid",
  "author": "lind",
  "permissions": [
    "tabs",
    "<all_urls>",
    "webRequest",
    "webRequestBlocking",
    "storage",
    "cookies",
    "system.cpu",
    "system.memory",
    "system.storage",
    "system.display"
  ],
  "browser_action": {
    "default_icon": "icon-16.png",
    "default_title": "点击登录系统"
  },
  "background": {
    "scripts": [
      "background.js"
    ],
    "persistent": true
  },
  "web_accessible_resources": [
    "popup.html",
    "popup.js"
  ]
}

```
# popup.html和popup.js
如果没有自定义表单，点图标就执行插件，这块就不需要了。

# background.js
这是核心代码，控制浏览器的行为，比如拦截请求，修改请求头，修改响应头，修改响应内容等等。
```javascript
// 监听消息
chrome.browserAction.onClicked.addListener(function (tab) {
    // 在这里处理收到的登录消息
    var machine = [];
    chrome.system.cpu.getInfo(function (info) {
        machine.push(info.archName);
        machine.push(info.numOfProcessors);
        machine.push(info.modelName);
        chrome.system.memory.getInfo(function (memory) {
            machine.push(memory.capacity);
            chrome.system.display.getInfo(function (dis) {
                var diss = "";
                dis.forEach(function (d) {
                    machine.push(d.id);
                });
                chrome.system.storage.getInfo(function (storageInfo) {
                    var storages = "";
                    storageInfo.forEach(function (storage) {
                        machine.push(storage.id);
                    });
                    chrome.cookies.set({
                        url: "https://cas.xxx.com/auth/",
                        name: "kc-token",
                        value: machine.join("_"),
                        domain: ".xxx.com",
                        path: "/",
                        secure: true,
                        httpOnly: true,
                        expirationDate: Math.floor((new Date().getTime() / 1000) + 3600) // 设置cookie过期时间
                    });

                });
            });

        });
    });
});
```

# 获取客户硬件信息

1. **chrome.system.memory**：用于获取系统内存信息，如总内存量、可用内存量等。

2. **chrome.system.storage**：用于获取存储设备（如硬盘、U盘）的信息，包括容量、可用空间等。

3. **chrome.system.display**：用于获取显示器信息，如分辨率、缩放比例等。

4. **chrome.system.network**：用于获取网络信息，如网络连接状态、IP地址等。

5. **chrome.system.power**：用于获取电源信息，如电池状态、剩余电量等。

这些API可以帮助开发者在Chrome插件中获取硬件相关的信息，以便实现更丰富的功能和用户体验。在使用这些API时，同样需要在`manifest.json`文件中声明相应的权限，例如：

```json
{
  "permissions": [
    "system.memory",
    "system.storage",
    "system.display",
    "system.network",
    "system.power"
  ]
}
```

通过合理地利用这些硬件信息接口，你可以为你的Chrome插件添加更多实用的功能，提升用户体验。如果有特定的硬件信息需求，建议查阅官方文档以获取更详细的信息和使用方法。

当使用Chrome Extension API中的`chrome.system.memory`和`chrome.system.storage`模块来获取客户端硬盘和内存的详细信息时，可以参考以下属性和方法：

### chrome.system.memory

- **`chrome.system.memory.getInfo()`**：获取系统内存信息。
    - **`capacity`**：系统总内存容量（以字节为单位）。
    - **`availableCapacity`**：系统可用内存容量（以字节为单位）。

示例代码：
```javascript
chrome.system.memory.getInfo(function(info) {
    console.log('总内存容量：', info.capacity);
    console.log('可用内存容量：', info.availableCapacity);
});
```

### chrome.system.storage

- **`chrome.system.storage.getInfo()`**：获取存储设备信息。
    - **`id`**：存储设备的唯一标识符。
    - **`name`**：存储设备的名称。
    - **`type`**：存储设备类型（如固态硬盘、机械硬盘等）。
    - **`capacity`**：存储设备总容量（以字节为单位）。
    - **`availableCapacity`**：存储设备可用容量（以字节为单位）。

示例代码：
```javascript
chrome.system.storage.getInfo(function(storageInfo) {
    storageInfo.forEach(function(info) {
        console.log('存储设备ID：', info.id);
        console.log('存储设备名称：', info.name);
        console.log('存储设备类型：', info.type);
        console.log('存储设备总容量：', info.capacity);
        console.log('存储设备可用容量：', info.availableCapacity);
    });
});
```

通过以上属性和方法，你可以在Chrome插件中获取到客户端硬盘和内存的详细信息，并根据需要进行相应的处理和展示。如果需要更多关于这些API的信息，建议查阅官方文档以获取更全面的指导。
