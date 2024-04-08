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

        console.log(port);
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
        const reader = port.readable.getReader(); // Create a new reader
        const { value, done } = await reader.read(); // Read from the stream
        reader.releaseLock(); // Release the reader's lock

        if (!done) {
            const responseData = new TextDecoder().decode(value);
            console.log('Received:', responseData);
            return responseData;
        }
    } catch (error) {
        console.error('Error reading data:', error);
    }
}


async function set_probe(addr, value) {
    try {
        await write(0, 0);
        await write(addr, value);
        await write(0, 1);
        await write(0, 0);
    } catch (error) {
        console.error('Error in set_probe:', error);
    }
}

async function get_probe(addr) {
    try {
        await write(0, 0);
        await write(0, 1);
        await write(0, 0);
        return await read(addr);
    } catch (error) {
        console.error('Error in set_probe:', error);
    }
}


document.getElementById('connectButton').addEventListener('click', connect);