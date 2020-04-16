document.getElementById('runCode').addEventListener('click', function() {
  let code = documment.getElementById('editor').innerHTML;

  try {
    evalBF(code);
  } catch(error) {
    console.error(error);
  }
});

document.getElementById('clearEditor').addEventListener('click', function() {
  documment.getElementById('editor').innerHTML = '';
});

document.getElementById('clearConsole').addEventListener('click', function() {
  documment.getElementById('console').innerHTML = '';
});

function output(str) {
  document.getElementById('console').innerHTML += str;
}
