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

    if (event.target.classList.contains('hestialink')) {
      load_show(event.target.getAttribute("hediaid"));
    };


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

    fetch(`${url}/spi/v3/jobs/${shortcode}`, {
        headers: {"Authorization": "Bearer kwdikos"},
        type: 'GET',
        Accept: "application/json",
        contentType: "application/json",
    })
    .then(response => response.json())
    .then(response => {

      let job_id = id_from_spi_key(response.id)
      let chrome_storage_key = `saved_job_${job_id}`
      let job_stage_key = `stage_${job_id}`

      response.saved_at = new Date().toLocaleString()
      response.company_name = window.location.hostname.split('.')[0].toUpperCase()

      chrome.storage.sync.set({ [chrome_storage_key]: response })
      console.log("job saved")

      chrome.storage.sync.set({[job_stage_key]: 'applied'}, function() {
        console.log(job_stage_key);
      });
      console.log("job state saved")
      load_show(job_id);
    })


}


function load_show(job_id){
    var hestia_div  = document.getElementById('hestiaDiv');

    fetch(chrome.extension.getURL("frames/show.html"))
    .then(response => response.text())
    .then(response => {
      hestia_div.innerHTML = response
    })
    .then(function() {
        render_saved_job(job_id)
    });
}

function render_saved_job(job_id){
    saved_job_key = `saved_job_${job_id}`
    chrome.storage.sync.get([saved_job_key], function(result) {
      description = document.getElementById('hestia-job-description')
      description.innerHTML = result[saved_job_key].description

      job_title = document.getElementById('hestia-job-title')
      job_title.innerHTML = result[saved_job_key].title

      company_name = document.getElementById('hestia-company-name')
      company_name.innerHTML = result[saved_job_key].company_name

      job_location = document.getElementById('hestia-job-location')
      loc_string = Object.values(result[saved_job_key].location).join(", ")
      job_location.innerHTML = loc_string

      job_url = document.getElementById('hestia-job-url')
      url = result[saved_job_key].shortlink.replace('https', 'http')
      job_url.innerHTML = "Go to Job"
      job_url.href = url

      date_saved = document.getElementById('hestia-date-saved')
      date_saved.innerHTML = 'Saved at: ' + result[saved_job_key].saved_at
    })

    let job_stage_key = `stage_${job_id}`
    chrome.storage.sync.get([job_stage_key], function(result) {

      if(result[`stage_${job_id}`] == 'applied'){
        var xhr2 = new XMLHttpRequest();

    xhr2.onreadystatechange = function (e) {
      if (xhr2.readyState == 4 && xhr2.status == 200) {
        // var new_results  = document.createElement ('div');
        // // new_results.classList.add('hidden');
        // new_results.style.visibility= 'hidden';
        // new_results.setAttribute("id", "hiddenResultsCareercup");
        // new_results.innerHTML = xhr2.responseText;
        // document.body.appendChild (new_results);
        // alert('here')
        // test = new_results.querySelectorAll('.st-result-text')
        jobs = JSON.parse(xhr2.response).jobs;
        for(var item in jobs) {
          console.log(jobs[item].url);
          console.log(jobs[item].title);
        }

        console.log(xhr2.responseText)
        console.log(xhr2)
        promoted_jobs = document.getElementById('tutorials')
        var list = document.createElement('ul');

        for(var item in jobs) {
        // Create the list item:
        var li = document.createElement('li');

        // Set its contents:
        var a = document.createElement('a')
        a.classList.add('link-arrow');
        a.innerHTML =`${jobs[item].title} - ${jobs[item].company.title}`
        a.href = jobs[item].url
        a.target = '_blank'
        li.appendChild(a);

        // Add it to the list:
        list.appendChild(li);
    }
    promoted_jobs.appendChild(list);
    // Finally, return the constructed list:
  

      }
    }

    xhr2.open("GET", 'https://production-jobboard.apps.workableops.net/api/v1/jobs?query=java&location=&orderBy=RELEVANCE_DESC', true);
    xhr2.setRequestHeader('Content-type', 'text/html');
    xhr2.send();
    }
  })
}

function load_dashboard(){
    var hestia_div  = document.getElementById('hestiaDiv');

    fetch(chrome.extension.getURL("frames/dashboard.html"))
    .then(response => response.text())
    .then(response => {
      hestia_div.innerHTML = response
    })
    .then(function() {
      list_saved_jobs();
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

function list_saved_jobs(){
    let saved_jobs = document.getElementById('saved-jobs');

    chrome.storage.sync.get(null, function(items) {
        var all_keys = Object.keys(items)

        all_keys.forEach(function(key) {

          chrome.storage.sync.get([key], function(result) {
            let job_link = document.createElement('a')
            job_link.setAttribute("hediaid", id_from_spi_key(result[key].id));
            job_link.innerHTML = result[key].title
            job_link.classList.add('hestialink');
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
     ele.submit();
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
                if (typeof label == "undefined"){
                    var label = "date";
                }
            obj[item.name] = [label, item.value];
            }
        }
        }

        var numberPattern = /\d+/g;

        var job_id = window.location.pathname.match( numberPattern )
        let chrome_storage_key = `candidate_${job_id}`
        chrome.storage.sync.set({[chrome_storage_key]: obj}, function() {
         });
}

