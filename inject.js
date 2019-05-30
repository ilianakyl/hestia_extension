(function() {

	var iframe  = document.createElement ('iframe');
iframe.src  = chrome.extension.getURL ('frames/start.html');
document.body.appendChild (iframe);

})();