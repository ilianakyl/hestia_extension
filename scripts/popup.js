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

        console.log(window.location)
        let shortcode = window.location.pathname.replace(/\/j\//,'');
        // let chrome_storage_key = `job_data_${shortcode}`
        
        // fetch(`http://batesmotel.lvh.me:3000/spi/v3/get/jobs/${shortcode}/`, {
        //     headers: {"Authorization": "Bearer 92f8b94a1d6ef0d31c4bcc3dfe5cc9102a676b5ccfe8443f9ee4fe16c5fee598"},
        //     type: 'GET',
        //     Accept: "application/json",
        //     contentType: "application/json",
        // })
        // .then(response => response.json())
        // .then(response => {
        //   chrome.storage.sync.set({key: response}, function() {
        //     console.log(key);
        //     console.log(response);
        //   });
        // });
    }
	

}, false);

document.addEventListener("submit", function (event) {
    alert('here')
    console.log('here')
    event.preventDefault();
        
    
    }, false);

