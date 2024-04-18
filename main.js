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
  console.log("(Main) received message from web worker: ", e.data)
  const result = e.data;
  awaitingInput = result.awaitingInput;
  output.value = result.output;
};

// serial comms

let port;

async function select() {
    try {
        const serialPort = await navigator.serial.requestPort();
        await serialPort.open({ baudRate: 115200 });
        port = serialPort;
        console.log('Connected to serial device:', port);
    } catch (error) {
        console.error('Error connecting to serial device:', error);
    }
}

async function write(data) {
    console.log("web serial api write() called with: ", data);
    const writer = port.writable.getWriter();
    await writer.write(new TextEncoder().encode(data));
    await writer.releaseLock();
}

async function read() {
    console.log("web serial api read() called!");
    const reader = port.readable.getReader();
    const {value, done} = await reader.read();
    reader.releaseLock();

    if (!done) {
        return new TextDecoder().decode(value);
    }
}

// main loop
let awaitingInput = false;

async function run() {
    console.log("(Main): Sending message to Web Worker: ", code.value);
    worker.postMessage(code.value);
}

async function checkForAwaitingInput() {
  if (awaitingInput) {
    await write("R0000\r\n");
    bytes_in = await read(1);
    console.log("(Main): Sending message to Service Worker: ", bytes_in);
    serviceWorker.postMessage(bytes_in);
  }
}

setInterval(checkForAwaitingInput, 100);
