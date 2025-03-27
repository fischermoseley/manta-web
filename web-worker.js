let pyodide;

importScripts("https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js");

(async function() {
  postMessage({pythonStatusText: "Python Status: Loading Pyodide"});
  pyodide = await loadPyodide({ indexURL : "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/" });

  postMessage({pythonStatusText: "Python Status: Loading micropip"});
  await pyodide.loadPackage("micropip");

  postMessage({pythonStatusText: "Python Status: Loading setuptools"});
  await pyodide.loadPackage("setuptools");

  postMessage({pythonStatusText: "Python Status: Loading manta-fpga"});
  const micropip = pyodide.pyimport("micropip");
  await micropip.install('manta_fpga-1.1.0-py3-none-any.whl');

  const response = await fetch('/main.py');
  pyodide.runPython(await response.text());

  postMessage({pythonStatusText: "Python Status: Loaded"});
})()

addEventListener('message', function(e) {
  console.log("(Web Worker): Message received from main thread: ", e.data);

  if ("capture" in e.data) {
    const vcdFile = pyodide.globals.get("capture")(e.data);
    console.log("(Web Worker): Got output from capture: ", vcdFile);
    postMessage({vcdFile: vcdFile});
  }

  if ("configFile" in e.data) {
    console.log("(Web Worker): Got configFile: ", e.data);
    pyodide.globals.get("load_config_file")(e.data.configFile);
  }
});

function blockingRequestToURL(url) {
  const request = new XMLHttpRequest();

  // `false` makes the request synchronous
  request.open('GET', url, false);
  request.send(null);
  console.log('status', request.status);
  return request.responseText;
}

function workerReadSerial() {
  console.log("(Web Worker): workerReadSerial called");
  postMessage({awaitingRead: true});
  data = blockingRequestToURL('/read_serial/');
  postMessage({awaitingRead: false});
  return data;
}

function workerWriteSerial(data) {
  console.log("(Web Worker): workerWriteSerial called with: ", data);
  postMessage({awaitingWrite: true, writeData: data});
  blockingRequestToURL('/write_serial/');
  postMessage({awaitingWrite: false, writeData: undefined});
}