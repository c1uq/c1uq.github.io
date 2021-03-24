
var run = function () {
	let runString = document.getElementById("run").value;
	eval(`document.getElementById("output").textContent = ${runString};`);
}