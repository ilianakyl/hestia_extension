(function() {

	var iframe  = document.createElement ('div');
iframe.src  = chrome.extension.getURL ('frames/start.html');
document.body.appendChild (iframe);

})();
