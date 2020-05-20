var getUserMedia = require("getusermedia");
getUserMedia({ video: true, audio: false }, function (err, stream) {
	if (err) return console.error(err);

	var Peer = require("simple-peer");
	var peer = new Peer({
		initiator: location.hash === "#init",
		trickle: false,
		stream: stream,
	});

	peer.on("signal", function (data) {
		document.getElementById("yourId").value = JSON.stringify(data);
	});

	var myJSON = '{"destination":"John", "value":31}'

	document.getElementById("connect").addEventListener("click", function () {
		var otherId = JSON.parse(document.getElementById("otherId").value);
		peer.signal(otherId);
	});

	document.getElementById("send").addEventListener("click", function () {
		var myObj = JSON.parse(myJSON);
		myObj.destination="message";
		myObj.value=document.getElementById("yourMessage").value+"";
		m=JSON.stringify(myObj);
		peer.send(m);
	});

	document.getElementById("generate").addEventListener("click", function () {
		var myObj = JSON.parse(myJSON);
		myObj.destination="result";
		var random=Math.random()*10;
		myObj.value=random+"";
		m=JSON.stringify(myObj);
		peer.send(m);
	});

	peer.on("data", function (data) {
		var d=JSON.parse(data);
		if(d.destination=="message"){
			document.getElementById("messages").textContent += d.value + "\n";
		}
		else{
			document.getElementById('result').innerHTML=d.value;
		}
		
	});

	peer.on("stream", function (stream) {
		var video = document.createElement("video");
		document.body.appendChild(video);
		video.srcObject = stream;
		//video.src = window.URL.createObjectURL(stream);
		//video.play();
	});
});
