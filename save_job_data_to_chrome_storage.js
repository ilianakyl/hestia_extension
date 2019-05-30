// use this command on the terminal to open chrome without CORS enabled to bypass SPI restrictions
// open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security

let shortcode = window.location.pathname.replace(/\/j\//,'');
let chrome_storage_key = `job_data_${shortcode}`

fetch(`http://batesmotel.lvh.me:3000/spi/v3/get/jobs/${shortcode}/`, {
    headers: {"Authorization": "Bearer 92f8b94a1d6ef0d31c4bcc3dfe5cc9102a676b5ccfe8443f9ee4fe16c5fee598"},
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


// To read it back
// chrome.storage.sync.get([chrome_storage_key], function(responseult) {
//   console.log('Value currently is ' + responseult.key);
// });