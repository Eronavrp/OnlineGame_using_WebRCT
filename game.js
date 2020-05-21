function rollDice(num1, num2) {
	const dice = [...document.querySelectorAll(".die-list")];
	var sum = 0;
	var rndNum = 0;
	var nums = [num1, num2];
	var i = 0;
	dice.forEach((die) => {
		toggleClasses(die);
		rndNum = nums[i % 2];
		die.dataset.roll = rndNum;
		sum += rndNum;
		i++;
	});
	document.getElementById("result").innerHTML = sum;
}

function toggleClasses(die) {
	die.classList.toggle("odd-roll");
	die.classList.toggle("even-roll");
}
