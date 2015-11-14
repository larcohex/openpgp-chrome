var message = "";
var secret = "";
var decrypted = "";

/*window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;*/

function readMessage (e) {
	var file = e.target.files[0];
	if (!file) {
		message = "";
	}
	var reader = new FileReader();
	reader.onload = function (e) {
		message = e.target.result;
	};
	reader.readAsText (file);
}


/*function readSecret (e) {
	var file = e.target.files[0];
	if (!file) {
		secret = "";
	}
	var reader = new FileReader();
	reader.onload = function (e) {
		secret = e.target.result;
	};
	reader.readAsText (file);
}*/

/*function onInitFs(fs) {

	fs.root.getFile('output.png', {create: true}, function(fileEntry) {

		// Create a FileWriter object for our FileEntry (log.txt).
		fileEntry.createWriter(function(fileWriter) {

			fileWriter.onwriteend = function(e) {
			console.log('Write completed.');
			};

			fileWriter.onerror = function(e) {
			console.log('Write failed: ' + e.toString());
			};

			// Create a new Blob and write it to log.txt.
			try {
				var bb = new BlobBuilder(); // Note: window.WebKitBlobBuilder in Chrome 12.
				bb.append(decrypted);
				fileWriter.write(bb.getBlob('text/png'));
			}
			catch (err)
			{
				var bb = new Blob([decrypted], { type: "image/png" }); // Note: window.WebKitBlobBuilder in Chrome 12.
				fileWriter.write(bb);
			}

		}, errorHandler);

	}, errorHandler);

}*/


/*function errorHandler(e) {
  var msg = '';

  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
  };

  console.log('Error: ' + msg);
}*/


function loadScript (url, callback)
{
	// Adding the script tag to the head as suggested before
	var head = document.getElementsByTagName ("head")[0];
	var script = document.createElement ("script");
	script.type = "text/javascript";
	script.src = url;

	// Then bind the event to the callback function.
	// There are several events for cross browser compatibility.
	script.onreadystatechange = callback;
	script.onload = callback;

	// Fire the loading
	head.appendChild (script);
}


document.addEventListener ("DOMContentLoaded", function() {
	document.getElementById ("message").addEventListener ("change", readMessage, false);
	var load = function() {
		requirejs (["lib/formats"], function (formats) {
			requirejs (["lib/openpgp"], function (pgp) {

				// Resetting output
				output = document.getElementById ("output");
				output.innerHTML = "";
				output.style.color = "black";

				// Checking if files and password are set
				if (document.getElementById ("message").value == "") {
					output.innerHTML = "Please select a message file";
					output.style.color = "red";
				}
				else if (document.getElementById ("secret").value == "") {
					output.innerHTML = "Please select a private key file";
					output.style.color = "red";
				}
				else if (document.getElementById ("password").value == "") {
					output.innerHTML = "Please enter password for private key";
				}
				else {

					// Decode message file
					pgp.formats.decodeKeyFormat (fs.createReadStream (document.getElementById ("secret").value).readUntilEnd (function (err, data) {
						if (err) {
							output.innerHTML = "Error while decoding a message";
							output.style.color = "red";
						}
						else {
							console.log (data);
						}
					});
				}
			});
		});
	}
	loadScript ("lib/require.js", load);
	// document.getElementById ("secret").addEventListener ("change", readSecret, false);
});
