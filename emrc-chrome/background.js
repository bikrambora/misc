var s = document.createElement('script');
s.src = chrome.extension.getURL('script.js');
s.onload = function() {
    this.remove();
};
console.log('background script');
(document.head || document.documentElement).appendChild(s);