var s = document.createElement('script');
s.src = chrome.extension.getURL('script.js');
s.onload = function() {
    this.remove();
};
console.log('content script');
(document.head || document.documentElement).appendChild(s);
//console.log(chrome);
//chrome.tabs.executeScript(null, {file: "script.js"});