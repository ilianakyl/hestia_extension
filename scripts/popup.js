window.addEventListener('click', function (event){
    event.preventDefault;

    switch(event.target.id) {
      case 'save-job':
        save_job();
        break;
      case 'dashboard':
        console.log("dashboard")
        load_dashboard()
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
    let chrome_storage_key = `job_data_${shortcode}`

    fetch(`${url}/spi/v3/jobs/${shortcode}/`, {
        headers: {"Authorization": "Bearer kwdikos"},
        type: 'GET',
        Accept: "application/json",
        contentType: "application/json",
    })
    .then(response => response.json())
    .then(response => {
      response.applied_at = new Date().toLocaleString();
      chrome.storage.sync.set({chrome_storage_key: response}, function() {
        console.log(chrome_storage_key);
        console.log(response);
      });
    })
}


function load_dashboard(){
    var hestia_div  = document.getElementById('hestiaDiv');
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function (e) {
      if (xhr.readyState == 4 && xhr.status == 200) {
        hestia_div.innerHTML = xhr.responseText;
      }
    }

    xhr.open("GET", chrome.extension.getURL("frames/saved_jobs.html"), true);
    xhr.setRequestHeader('Content-type', 'text/html');
    xhr.send();
}


function fill_jobs(){
    let saved_jobs  = document.getElementById ('saved-jobs-table');

    var NewRow = saved_jobs.insertRow(0);
    var Newcell1 = NewRow.insertCell(0);
    var Newcell2 = NewRow.insertCell(1);
    Newcell1.innerHTML = "col1";
    Newcell2.innerHTML = "col2";
}


// document.addEventListener("submit", function (event) {
//     alert('here')
//     console.log('here')
//     event.preventDefault();
// }, false);

