var message = "";
var secret = "";

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


function readSecret (e) {
	var file = e.target.files[0];
	if (!file) {
		secret = "";
	}
	var reader = new FileReader();
	reader.onload = function (e) {
		secret = e.target.result;
	};
	reader.readAsText (file);
}


function loadScript (url, callback)
{
	var head = document.getElementsByTagName ("head")[0];
	var script = document.createElement ("script");
	script.type = "text/javascript";
	script.src = url;

	script.onreadystatechange = callback;
	script.onload = callback;

	head.appendChild (script);
}


document.addEventListener ("DOMContentLoaded", function() {
	document.getElementById ("message").addEventListener ("change", readMessage, false);
	document.getElementById ("secret").addEventListener ("change", readSecret, false);
	var load = function() {
		document.getElementById ("decrypt").addEventListener ("click", function() {

			output = document.getElementById ("output");
			output.innerHTML = "";
			output.style.color = "black";


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
				var loading = document.createElement ("img");
				loading.src = "resources/img/loading.gif";
				document.getElementById ("imgDiv").appendChild (loading);
				var privateKey = openpgp.key.readArmored (secret).keys[0];
				privateKey.decrypt (document.getElementById ("password").value);
				message = openpgp.message.readArmored (message);
				openpgp.decryptMessage (privateKey, message).then (function (plaintext) {
					var img = document.createElement ("img");
					img.src = "data:image/png;base64," + plaintext;
					document.getElementById ("imgDiv").removeChild (loading);
					document.getElementById ("imgDiv").appendChild (img);
					output.innerHTML = "Successfully read";
					output.style.color = "black";
				}).catch (function (error) {
					output.innerHTML = "Error while decrypting";
					output.style.color = "red";
				});
			}
		});
	}
	loadScript ("openpgp.js", load);
});
