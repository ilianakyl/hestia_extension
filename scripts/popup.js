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

	

}, false);
