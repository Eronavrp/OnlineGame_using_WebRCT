var tracks;
var myVideo = document.createElement("video");
			if(navigator.getUserMedia)
			{
				navigator.getUserMedia({ video: {
        width: { ideal: 100},
        height: { ideal: 100 }
    }},handleVideo, videoError);
			}
			function handleVideo(stream)
			{
				document.getElementById("myCamera").appendChild(myVideo);
				myVideo.srcObject = stream;
				tracks = stream.getTracks();
				myVideo.play();
			}
			function videoError(e)
			{

			}

var video = document.createElement("video");
var getUserMedia = require("getusermedia");
var tracks2;

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
		var win=15;
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

			tracks.forEach(function(track) {
			track.enabled = !track.enabled;
			
		});
			var myObj = JSON.parse(myJSON);
			myObj.destination = "camera";
			m = JSON.stringify(myObj);
			peer.send(m);
		});

		document.getElementById("play").addEventListener("click", function () {
			document.getElementById("play").disabled = true;
			var myObj = JSON.parse(myJSON);

			myObj.destination = "result";
			var myResult = parseInt(document.getElementById("result").innerHTML);
			var myScore=parseInt(document.getElementById('me').innerHTML);
			if(myResult!=7){
				myScore+=myResult;
			}
			else{
				myScore=0;
			}
			document.getElementById('me').innerHTML=myScore;
			if(myScore>=win){
				var end=document.getElementById('winner');
				end.innerHTML="Won";
				end.style.color='indigo';
				document.getElementById('dice').style='display:none';
				document.getElementById('win').style='display:block';
			}
			rndNum1 = parseInt(document.getElementById("rndNum1").value);
			rndNum2 = parseInt(document.getElementById("rndNum2").value);
			myObj.value = myScore;
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
			}
			else if (d.destination=="camera")
			{
				tracks2[0].enabled = !tracks2[0].enabled;				
			} 
			else {
				document.getElementById("play").disabled = false;
				rollDice(d.firstNum, d.secondNum);
				document.getElementById('friend').innerHTML = d.value;
				if(d.value>=win){
					document.getElementById('dice').style='display:none';
				    var end=document.getElementById('winner');
				    end.innerHTML="Lost";
					end.style.color='darkred';
					document.getElementById('win').style='display:block';
				}
			}
		});

		peer.on("stream", function (stream) {
			var video = document.createElement("video");
			document.getElementById("video").appendChild(video);
			//document.body.appendChild(video);
			video.srcObject = stream;
			tracks2 = stream.getTracks();
			//video.src = window.URL.createObjectURL(stream);
			video.play();
		});

		peer.on('connect', () => {
			document.getElementById("connection").style="display:none";
			document.getElementById("dice").style="display:block";
		})

	});
