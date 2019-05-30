(function() {

	var new_div  = document.createElement ('div');

var xhr = new XMLHttpRequest();
  
    xhr.onreadystatechange = function (e) { 
      if (xhr.readyState == 4 && xhr.status == 200) {
        new_div.innerHTML = xhr.responseText;
      }
    }
  
    xhr.open("GET", chrome.extension.getURL("frames/start.html"), true);
    xhr.setRequestHeader('Content-type', 'text/html');
    xhr.send();

    document.body.appendChild (new_div);
})();
