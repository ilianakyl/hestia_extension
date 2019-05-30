console.log('test')
document.addEventListener('click', function (event) {
console.log('here')
	// If the clicked element doesn't have the right selector, bail
	if (event.target.matches('#clickIt')){
        console.log('here2')
        // Don't follow the link
        event.preventDefault();

        // Log the clicked element in the console
        console.log(event.target);
    }

    
    if (event.target.matches('#save')){
        console.log('here3')
        // Don't follow the link
        event.preventDefault();

        let url = window.location.protocol+"//"+window.location.host
        let shortcode = window.location.pathname.replace(/\/j\//,'');
        let chrome_storage_key = `job_data_${shortcode}`
        
        fetch(`${url}/spi/v3/get${shortcode}/`, {
            headers: {"Authorization": "Bearer 49d962d93e03722c70359d8910e5d870b005f23312552df900b25ebed775672b"},
            type: 'GET',
            Accept: "application/json",
            contentType: "application/json",
        })
        .then(response => response.json())
        .then(response => {
          chrome.storage.sync.set({key: response}, function() {
            console.log(key);
            console.log(response);
          });
        });
        var new_div  = document.getElementById ('hestiaDiv');
        var xhr = new XMLHttpRequest();
  
    xhr.onreadystatechange = function (e) { 
      if (xhr.readyState == 4 && xhr.status == 200) {
        new_div.innerHTML = xhr.responseText;
      }
    }
  
    xhr.open("GET", chrome.extension.getURL("frames/list.html"), true);
    xhr.setRequestHeader('Content-type', 'text/html');
    xhr.send();

    }
	

}, false);

document.addEventListener("submit", function (event) {
    alert('here')
    console.log('here')
    event.preventDefault();
        
    
    }, false);

