// 监听单击事件，不需要有html界面的
//chrome.browserAction.onClicked.addListener(function (tab) {
// 监听html界面的单击事件，它会在点击插件图标时触发sendMessage事件到background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {    // 在这里处理收到的登录消息
    if(message.action==='login') {
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
                            url: "https://cas.pkulaw.com/auth/",
                            name: "kc-token",
                            value: machine.join("_"),
                            domain: ".pkulaw.com",
                            path: "/",
                            secure: true,
                            httpOnly: true,
                            expirationDate: Math.floor((new Date().getTime() / 1000) + 3600) // 设置cookie过期时间
                        });
                    });
                });

            });
        });
    }
    sendResponse('Message received,send pid '+message.pid+' to server success/');

});

