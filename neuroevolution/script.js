var editor=document.getElementById("editor"),
consOutput=document.querySelector("#console div#output"),
consInput=document.querySelector("#console input");

var waitingForInput=false,
receivedInput=false,
inputChr="",
consoleText=">";
function input() {
	waitingForInput=true;
	consInput.focus();
}

function output(chr) {
	consoleText+=chr;
	consOutput.innerText=consoleText;
}
function clearConsole() {
	consoleText=">";
	consOutput.innerText=">";
}
function clearEditor() {
	editor.value="";
}

function runCode() {
	let code = document.getElementById('editor').innerText;

	try {
		evalBF(code);
	} catch(error) {
		console.error(error);
	}
}
