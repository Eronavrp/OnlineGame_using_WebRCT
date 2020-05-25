// Video element which will show the camera stream of the user
var myVideo = document.createElement("video");

var getUserMedia = require("getusermedia");

var win = 15;

var myJSON = '{"destination":"John", "value":31, "firstDie":1, "secondDie":2}';

// Asking for the permission to use camera and microphone of the user
getUserMedia(
	{
		video: true,
		audio: true,
	},
	// Callback function in case that the permission is granted or not
	function (err, stream) {
		if (err) return console.error(err);

		myVideo.width = 150;
		document.getElementById("myCamera").appendChild(myVideo);
		myVideo.srcObject = stream;

		// Import the simple-peer module and create the peer object
		var Peer = require("simple-peer");
		var peer = new Peer({
			initiator: location.hash === "#init",
			trickle: false,
			stream: stream,
		});

		// Generate the peer's ID when signaled
		peer.on("signal", function (data) {
			document.getElementById("yourId").value = JSON.stringify(data);
			console.log(data);
		});

		// Send signal to estabilish a connection
		document
			.getElementById("connect")
			.addEventListener("click", function () {
				var otherId = JSON.parse(
					document.getElementById("otherId").value
				);
				peer.signal(otherId);
			});

		// Send a text message when send button is clicked
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

		var input_field = document.getElementById("yourMessage");

		// Send text message when enter button is pressed
		input_field.addEventListener("keyup", function (event) {
			if (event.keyCode === 13) {
				event.preventDefault();
				document.getElementById("send").click();
			}
		});

		// Start/stop video/audio

		document
			.getElementById("toggleVideo")
			.addEventListener("click", function () {
				tracksTemp = stream.getVideoTracks();
				tracksTemp.forEach(function (track) {
					track.enabled = !track.enabled;
				});
				this.classList.toggle("red");
			});
		document
			.getElementById("toggleAudio")
			.addEventListener("click", function () {
				tracksTemp = stream.getAudioTracks();
				tracksTemp.forEach(function (track) {
					track.enabled = !track.enabled;
				});
				this.classList.toggle("red");
			});

		var myScore = parseInt(document.getElementById("me").innerHTML);

		// Throw the dice when play button is clicked
		document.getElementById("play").addEventListener("click", function () {
			document.getElementById("play").disabled = true;
			var myObj = JSON.parse(myJSON);

			var num1 = Math.floor(Math.random() * 6) + 1;
			var num2 = Math.floor(Math.random() * 6) + 1;
			rollDice(num1, num2);

			myObj.destination = "result";
			var myResult = num1 + num2;

			if (myResult != 7) {
				myScore += myResult;
			} else {
				myScore = 0;
			}
			setTimeout(() => {
				document.getElementById("me").innerHTML = myScore;
			}, 1600);

			if (myScore >= win) {
				setTimeout(() => {
					var end = document.getElementById("winner");
					end.innerHTML = "You Won !";
					end.style.color = "indigo";
					document.getElementById("dice").style = "display:none";
					document.getElementById("win").style = "display:block";
				}, 2200);
			}
			myObj.value = myScore;
			myObj.firstNum = num1;
			myObj.secondNum = num2;
			m = JSON.stringify(myObj);
			peer.send(m);
		});

		// Receiving data
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
			} else if (d.destination == "playAgain") {
				document.getElementById("friend").innerHTML = 0;
				document.getElementById("dice").style = "display:block";
				document.getElementById("win").style = "display:none";
				document.getElementById("me").innerHTML = 0;
				myScore = d.value;
			} else {
				document.getElementById("play").disabled = false;
				rollDice(d.firstNum, d.secondNum);
				setTimeout(() => {
					document.getElementById("friend").innerHTML = d.value;
				}, 1600);

				if (d.value >= win) {
					setTimeout(() => {
						document.getElementById("dice").style = "display:none";
						var end = document.getElementById("winner");
						end.innerHTML = " You Lost !";
						end.style.color = "darkred";
						document.getElementById("win").style = "display:block";
					}, 2200);
				}
			}
		});

		// Replay after the playagain button is clicked
		document
			.getElementById("playAgain")
			.addEventListener("click", function () {
				myScore = 0;
				document.getElementById("dice").style = "display:block";
				document.getElementById("win").style = "display:none";
				var myObj = JSON.parse(myJSON);
				myObj.destination = "playAgain";
				document.getElementById("friend").innerHTML = 0;
				document.getElementById("me").innerHTML = 0;
				myObj.value = 0;
				m = JSON.stringify(myObj);
				peer.send(m);
			});

		// Receiving stream from the other peer
		peer.on("stream", function (stream2) {
			var video = document.createElement("video");
			document.getElementById("video").style.height = "auto";
			video.style.width = "100%";
			console.log(video.style.width);
			video.style.height = "100%";
			document.getElementById("video").appendChild(video);
			video.srcObject = stream2;
			video.play();
		});

		// Hide id inputs after the connection is estabilished
		peer.on("connect", () => {
			document.getElementById("connection").style = "display:none";
			document.getElementById("dice").style = "display:block";
			myVideo.play();
		});
	}
);
