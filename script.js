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
        const sendData = `W${addr.toString(16).padStart(4, '0')}${data.toString(16).padStart(4, '0')}`;

        // Example: Sending data to the device
        const writer = port.writable.getWriter();
        await writer.write(new TextEncoder().encode(sendData));
        await writer.releaseLock();
        console.log('Sent data:', sendData);
    } catch (error) {
        console.error('Error sending data:', error);
    }
}

async function set_probe() {
    try {
        await write(0, 0);
        await write(1, 1);
        await write(0, 1);
        await write(0, 0);
    } catch (error) {
        console.error('Error in set_probe:', error);
    }
}

document.getElementById('connectButton').addEventListener('click', connect);
document.getElementById('writeButton').addEventListener('click', set_probe);
