// serial.js
let port;

async function connect() {
    try {
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: 115200 });
        console.log('Connected to serial device:', port);
    } catch (error) {
        console.error('Error connecting to serial device:', error);
    }
}

async function write(addr, data) {
    try {
        if (!port) {
            console.error('Serial port not connected');
            return;
        }

        // Format the data to be sent
        const sendData = `W${addr.toString(16).padStart(4, '0')}${data.toString(16).padStart(4, '0')}\r\n`;

        // Example: Sending data to the device
        const writer = port.writable.getWriter();
        await writer.write(new TextEncoder().encode(sendData));
        await writer.releaseLock();
        console.log('Sent:', sendData);
    } catch (error) {
        console.error('Error sending data:', error);
    }
}

async function read(addr) {
    try {
        if (!port) {
            console.error('Serial port not connected');
            return;
        }

        // Format the read command
        const readCmd = `R${addr.toString(16).padStart(4, '0')}\r\n`;

        // Send the read command to the device
        const writer = port.writable.getWriter();
        await writer.write(new TextEncoder().encode(readCmd));
        await writer.releaseLock();
        console.log('Sent:', readCmd);

        // Read back the response
        const { value, done } = await port.readable.getReader().read();
        if (!done) {
            const responseData = new TextDecoder().decode(value);
            console.log('Received:', responseData);
            return responseData;
        }
    } catch (error) {
        console.error('Error reading data:', error);
    }
}

async function set_probe() {
    try {
        await write(0, 0);
        await write(2, 1);
        await write(0, 1);
        await write(0, 0);

        const result = await read(1);
        console.log('Result of read:', result); // Log the result to the console
    } catch (error) {
        console.error('Error in set_probe:', error);
    }
}

document.getElementById('connectButton').addEventListener('click', connect);
document.getElementById('writeButton').addEventListener('click', set_probe);
