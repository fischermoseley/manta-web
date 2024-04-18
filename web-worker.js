let pyodide;

importScripts("https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js");


(async function() {
  pyodide = await loadPyodide({ indexURL : "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/" });
    const response = await fetch('/main.py');
    pyodide.runPython(await response.text())
    console.log("(Web Worker) Python loaded!")
})()

addEventListener('message', function(e) {
  const output = pyodide.globals.get("capture")(e.data);
  console.log("(Web Worker): Message received from main thread: ", e.data);
  postMessage({awaitingInput: false, output: output})
});

function readSerial(nBytes) {
  console.log("(Web Worker): readSerial called with: ", nBytes);
  postMessage({awaitingInput: true, nBytes: nBytes});
  const request = new XMLHttpRequest();

  // `false` makes the request synchronous
  request.open('GET', '/read_serial/', false);
  request.send(null);
  console.log('status', request.status);
  return request.responseText;
}

