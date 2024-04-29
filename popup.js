document.getElementById('loginButton').addEventListener('click', function () {
    var pid = document.getElementById('pid').value;
    chrome.runtime.sendMessage({action: 'login', pid: pid}, function (response) {
        alert(response);
    });
});

//可获取当前设备的状态，设备可存储到strage中
fetch('https://xxx.xxx.com/auth/realms/xxx', {
    method: 'GET'
}).then(response => response.json()).then(data => {
    $("#realm").text("当前域："+data.realm);
    $("#public_key").text("公钥："+data.public_key);
}).catch((error) => {
    console.log(error);
});
