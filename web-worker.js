let pyodide;

importScripts("https://cdn.jsdelivr.net/pyodide/v0.19.0/full/pyodide.js");

(async function() {
  pyodide = await loadPyodide({ indexURL : "https://cdn.jsdelivr.net/pyodide/v0.19.0/full/" });
    const response = await fetch('/main.py');
    pyodide.runPython(await response.text())
    console.log("Ready")
})()

addEventListener('message', function(e) {
  const output = pyodide.globals.get("run_code")(e.data);
  postMessage({awaitingInput: false, output: output})
});

function getInput(output) {
  postMessage({awaitingInput: true, output: output});
  const request = new XMLHttpRequest();
  // `false` makes the request synchronous
  request.open('GET', '/get_input/', false);
  request.send(null);
  console.log('status', request.status);
  return request.responseText;
}

