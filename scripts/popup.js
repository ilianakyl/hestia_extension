// Utility Functions
var spi_key_for = id => (id + 1234).toString(16);
var id_from_spi_key = key => parseInt(key, 16) - 1234


window.addEventListener('click', function (event){
    event.preventDefault;

    switch(event.target.id) {
      case 'hestia-save-job':
        save_job();
        break;
      case 'hestia-dashboard':
      case 'hestia-back-to-dashboard':
        console.log("dashboard")
        load_dashboard();
        break;
      case 'hestia-back-to-start':
        console.log("start")
        load_start_page();
        break;

    }

    //Bail if our clicked element doesn't have the class
    if (!event.target.classList.contains('accordion-toggle')) return;

    // Get the target content
    var content = document.querySelector(event.target.hash);
    if (!content) return;

    // Prevent default link behavior
    event.preventDefault();

    // If the content is already expanded, collapse it and quit
    if (content.classList.contains('active')) {
      content.classList.remove('active');
      return;
    }

    // Get all open accordion content, loop through it, and close it
    var accordions = document.querySelectorAll('.accordion-content.active');
    for (var i = 0; i < accordions.length; i++) {
      accordions[i].classList.remove('active');
    }

    // Toggle our content
    content.classList.toggle('active');
})


function save_job(){
    let url = window.location.protocol + "//" + window.location.host
    let shortcode = window.location.pathname.replace(/\/j\//,'');

    fetch(`${url}/spi/v3/jobs/${shortcode}/`, {
        headers: {"Authorization": "Bearer kwdikos"},
        type: 'GET',
        Accept: "application/json",
        contentType: "application/json",
    })
    .then(response => response.json())
    .then(response => {

      let job_id = id_from_spi_key(response.id)
      let chrome_storage_key = `saved_job_${job_id}`

      chrome.storage.sync.set({ [chrome_storage_key]: response })
      console.log("job saved")
    })

    load_show();
}


function load_show(){
    var hestia_div  = document.getElementById('hestiaDiv');
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function (e) {
      if (xhr.readyState == 4 && xhr.status == 200) {
        hestia_div.innerHTML = xhr.responseText;
      }
    }

    xhr.open("GET", chrome.extension.getURL("frames/show.html"), true);
    xhr.setRequestHeader('Content-type', 'text/html');
    xhr.send();
}


function load_dashboard(){
    var hestia_div  = document.getElementById('hestiaDiv');

    fetch(chrome.extension.getURL("frames/dashboard.html"))
    .then(response => response.text())
    .then(response => {
      hestia_div.innerHTML = response
    })
    .then(function() {
      fill_saved_jobs();
    });
}


function load_start_page(){
    var hestia_div  = document.getElementById('hestiaDiv');
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function (e) {
      if (xhr.readyState == 4 && xhr.status == 200) {
        hestia_div.innerHTML = xhr.responseText;
      }
    }

    xhr.open("GET", chrome.extension.getURL("frames/start.html"), true);
    xhr.setRequestHeader('Content-type', 'text/html');
    xhr.send();
}

function fill_saved_jobs(){
    let saved_jobs = document.getElementById('saved-jobs');

    chrome.storage.sync.get(null, function(items) {
        var all_keys = Object.keys(items)

        all_keys.forEach(function(key) {

          chrome.storage.sync.get([key], function(result) {
            let job_link = document.createElement('a')
            job_link.href = result[key].url
            saved_jobs.appendChild(job_link)
          })
        })
    })
}


var ele = document.getElementById('new_candidate');
if (ele){
ele.addEventListener("submit", function (event) {
     console.log('here')
     event.preventDefault();
     getCandidateInfo(event);
    //  ele.submit();
 }, false);
}

function getCandidateInfo(event){
        var elements = document.getElementById('new_candidate').elements;
        var obj ={};
        for(var i = 0 ; i < elements.length ; i++){

            var item = elements.item(i);
            if (elements.item(i).type != 'hidden'){
                var label = '';
            if (elements.item(i).placeholder != ""){
                var label = elements.item(i).placeholder

            }else{
                if (elements.item(i).parentElement.className.trim() == "form-group"){
                    parent = elements.item(i).parentElement
                }else if (elements.item(i).parentElement.className == "form-group form-group--error"){
                    parent = elements.item(i).parentElement
                }else{
                    parent = elements.item(i).parentElement.parentElement
                }

                if (typeof parent.getElementsByTagName('label')[0] !== "undefined"){
                var label = parent.getElementsByTagName('label')[0].innerText
                }
            }
            if (label !="" && item.value != "" && label != "* Name"){
            obj[item.name] = [label, item.value];
            }
        }
        }

        var numberPattern = /\d+/g;

        var job_id = window.location.pathname.match( numberPattern )
        let chrome_storage_key = `candidate_${job_id}`
        chrome.storage.sync.set({[chrome_storage_key]: obj}, function() {
      });
	console.log("thats it");

}

