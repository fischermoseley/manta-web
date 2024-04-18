const output = document.getElementById("output");
const code = document.getElementById("code");

let serviceWorker;

navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
  serviceWorker = registration.active;
  if (!serviceWorker) {
    location.reload();
  }
});

const worker = new Worker('/web-worker.js');
worker.onmessage = function(e) {
  const result = e.data;
  awaitingInput = result.awaitingInput;
  output.value = result.output;
};

let awaitingInput = false;

function run() {
  if (awaitingInput) {
    serviceWorker.postMessage(code.value);
  } else {
    worker.postMessage(code.value);
  }
}

