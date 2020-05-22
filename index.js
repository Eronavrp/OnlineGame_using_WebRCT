var getUserMedia = require("getusermedia");
var tracks;
getUserMedia(
	{
		video: {
			width: { ideal: 436 },
			height: { ideal: 300 },
		},
		audio: false,
	},
	function (err, stream) {
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

		var myJSON =
			'{"destination":"John", "value":31, "firstDie":1, "secondDie":2}';

		document
			.getElementById("connect")
			.addEventListener("click", function () {
				var otherId = JSON.parse(
					document.getElementById("otherId").value
				);
				peer.signal(otherId);
			});

		document.getElementById("send").addEventListener("click", function () {
			console.log("abcabca");
			var d = new Date();
			var hour = d.getHours();
			if (hour / 10 < 1) hour = "0" + hour;
			var minutes = d.getMinutes();
			if (minutes / 10 < 1) minutes = "0" + minutes;
			var message = document.getElementById("yourMessage").value;
			document.getElementById("yourMessage").value = "";
			var chatWithText = document.getElementById("chatWithText");
			chatWithText.innerHTML +=
				"<div class='d-flex justify-content-end mb-4'>\n" +
				"<div class='msg_cotainer_send'>\n" +
				message +
				"<span class='msg_time_send'>" +
				hour +
				":" +
				minutes +
				"</span>\n" +
				"</div>\n" +
				"<div class='img_cont_msg'>\n" +
				"<img src='x-men.png' class='rounded-circle user_img_msg'>\n" +
				"</div>\n" +
				"</div>";

			chatWithText.scrollTop = chatWithText.scrollHeight;
			var myObj = JSON.parse(myJSON);
			myObj.destination = "message";
			myObj.value = message + "";
			m = JSON.stringify(myObj);
			peer.send(m);
		});

		document.getElementById("startOrStopCamera").addEventListener("click",function(){

			//tracks.forEach(function(track) {
			tracks[0].enabled = !tracks[0].enabled;
		//});
		});

		document.getElementById("play").addEventListener("click", function () {
			document.getElementById("play").disabled = true;
			//document.getElementById("play").classList.toggle("disabled");

			var myObj = JSON.parse(myJSON);

			myObj.destination = "result";
			//var random = Math.random() * 10;
			var random = parseInt(document.getElementById("result").innerHTML);

			rndNum1 = parseInt(document.getElementById("rndNum1").value);
			rndNum2 = parseInt(document.getElementById("rndNum2").value);
			//rollDice2(rndNum1, rndNum2);
			myObj.value = random;
			myObj.firstNum = rndNum1;
			myObj.secondNum = rndNum2;
			m = JSON.stringify(myObj);
			peer.send(m);
		});

		peer.on("data", function (data) {
			var d = new Date();
			var hour = d.getHours();
			if (hour / 10 < 1) hour = "0" + hour;
			var minutes = d.getMinutes();
			if (minutes / 10 < 1) minutes = "0" + minutes;
			var d = JSON.parse(data);
			if (d.destination == "message") {
				var chatWithText = document.getElementById("chatWithText");
				chatWithText.innerHTML +=
					"<div class='d-flex justify-content-start mb-4'>\n" +
					"<div class='img_cont_msg'>\n" +
					"<img src='x-men.png' class='rounded-circle user_img_msg'>\n" +
					"</div>\n" +
					"<div class='msg_cotainer'>\n" +
					d.value +
					"<span class='msg_time'>" +
					hour +
					":" +
					minutes +
					"</span>\n" +
					"</div>\n" +
					"</div>";
				chatWithText.scrollTop = chatWithText.scrollHeight;
			} else {
				document.getElementById("play").disabled = false;
				rollDice(d.firstNum, d.secondNum);
				document.getElementById("result").innerHTML = d.value;
			}
		});

		peer.on("stream", function (stream) {
			var video = document.createElement("video");
			document.getElementById("video").appendChild(video);
			//document.body.appendChild(video);
			video.srcObject = stream;
			tracks = stream.getTracks();
			//video.src = window.URL.createObjectURL(stream);
			video.play();
		});
	}
);
