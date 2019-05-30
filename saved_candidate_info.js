let shortcode = window.location.pathname.replace(/\/j\//,'');
//let response =

key = `candidate_data_{shortcode}`
  chrome.storage.sync.set({key: response}, function() {
    console.log(`Job value seet with key:${key} and value:${response}`);
  });

JSON.parse('{"' + decodeURI(response).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
