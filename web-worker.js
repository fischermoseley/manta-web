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

function blockingRequestToURL(url) {
  const request = new XMLHttpRequest();

  // `false` makes the request synchronous
  request.open('GET', url, false);
  request.send(null);
  console.log('status', request.status);
  return request.responseText;
}

function workerReadSerial(nBytes) {
  console.log("(Web Worker): workerReadSerial called with: ", nBytes);
  postMessage({awaitingInput: true, nBytes: nBytes});
  blockingRequestToURL('/read_serial/')
}

function workerWriteSerial(data) {
  console.log("(Web Worker): workerWriteSerial called with: ", data);
  postMessage({awaitingInput: true, data: data});
  blockingRequestToURL('/write_serial/')
}