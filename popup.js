document.addEventListener ("DOMContentLoaded", function() {
	chrome.tabs.create ({"url": chrome.extension.getURL ("index.html")}, function(tab) {
		window.close();
	});
});