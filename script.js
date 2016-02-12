var public = "";
var private = "";

function signPublicKey(public_key, private_key) {
	// Returns a new public key which is public_key + signature(private_key)
	private_key.decrypt (document.getElementById ("password").value);
	var dataToSign = {};
	dataToSign.userid = public_key.users[0].userId;
	dataToSign.key = public_key.primaryKey;

	var signaturePacket = new openpgp.packet.Signature();
	signaturePacket.signatureType = openpgp.enums.signature.cert_generic;
	signaturePacket.publicKeyAlgorithm = 1;
	signaturePacket.hashAlgorithm = 2;
	signaturePacket.keyFlags = [openpgp.enums.keyFlags.certify_keys | openpgp.enums.keyFlags.sign_data];
	signaturePacket.preferredSymmetricAlgorithms = [];
	signaturePacket.preferredSymmetricAlgorithms.push(openpgp.enums.symmetric.aes256);
	signaturePacket.preferredSymmetricAlgorithms.push(openpgp.enums.symmetric.aes192);
	signaturePacket.preferredSymmetricAlgorithms.push(openpgp.enums.symmetric.aes128);
	signaturePacket.preferredSymmetricAlgorithms.push(openpgp.enums.symmetric.cast5);
	signaturePacket.preferredSymmetricAlgorithms.push(openpgp.enums.symmetric.tripledes);
	signaturePacket.preferredHashAlgorithms = [];
	signaturePacket.preferredHashAlgorithms.push(openpgp.enums.hash.sha256);
	signaturePacket.preferredHashAlgorithms.push(openpgp.enums.hash.sha1);
	signaturePacket.preferredHashAlgorithms.push(openpgp.enums.hash.sha512);
	signaturePacket.preferredCompressionAlgorithms = [];
	signaturePacket.preferredCompressionAlgorithms.push(openpgp.enums.compression.zlib);
	signaturePacket.preferredCompressionAlgorithms.push(openpgp.enums.compression.zip);
	signaturePacket.sign(private_key.getEncryptionKeyPacket(), dataToSign);

	var originalPackets = public_key.toPacketlist();
	var packetlist = new openpgp.packet.List();
	for (var i=0; i<originalPackets.length; i++) {
		packetlist.push(originalPackets[i]);
	}
	packetlist.push(public_key.users[0].userId);
	console.log (signaturePacket);
	packetlist.push(signaturePacket);
	return new openpgp.key.Key(packetlist);
}


function readPublic (e) {
	var file = e.target.files[0];
	if (!file) {
		public = "";
	}
	var reader = new FileReader();
	reader.onload = function (e) {
		public = e.target.result;
	};
	reader.readAsText (file);
}



function readPrivate (e) {
	var file = e.target.files[0];
	if (!file) {
		private = "";
	}
	var reader = new FileReader();
	reader.onload = function (e) {
		private = e.target.result;
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
	document.getElementById ("public").addEventListener ("change", readPublic, false);
	document.getElementById ("private").addEventListener ("change", readPrivate, false);
	var load = function() {
		document.getElementById ("sign").addEventListener ("click", function() {

			output = document.getElementById ("output");
			output.innerHTML = "";
			output.style.color = "black";


			if (document.getElementById ("public").value == "") {
				output.innerHTML = "Please select a public key file";
				output.style.color = "red";
			}
			else if (document.getElementById ("private").value == "") {
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
				var publicKey = openpgp.key.readArmored (public).keys[0];
				var privateKey = openpgp.key.readArmored (private).keys[0];
				var signedKey = signPublicKey (publicKey, privateKey);
				document.getElementById("imgDiv").removeChild (loading);
				output.innerHTML = signedKey.armor();
			}
		});
	}
	loadScript ("openpgp.js", load);
});
