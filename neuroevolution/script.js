<<<<<<< HEAD
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
=======
document.getElementById('runCode').addEventListener('click', function() {
  let code = documment.getElementById('editor').innerHTML;

  try {
    evalBF(code);
  } catch(error) {
    console.error(error);
  }
});

output(str) {
  document.getElementById('console').innerHTML += str;
>>>>>>> 1b9a39193816df5c371f70612c1c3695ccbedeff
}
