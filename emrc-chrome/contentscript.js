var script = document.createElement('script');
script.onload = function() {
    this.remove();
};
script.src = chrome.extension.getURL('script.js');
(document.head || document.documentElement).appendChild(script);