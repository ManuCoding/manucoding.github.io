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
}
