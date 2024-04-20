## manta-web

This demo works by bringing together a few technologies:
- [Pyodide](https://github.com/pyodide/pyodide), a Python environment that runs in the browswer via a version of the Python interpreter compiled for WebAssembly.
- The [Web Serial API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API), which allows the browswer to communicate with serial ports on the host machine.
- [Surfer](https://surfer-project.org/), a cross-platform waveform viewer written in Rust which has been compiled for WebAssembly.
- [sync-message](https://github.com/alexmojaki/sync-message), which isn't used directly, but the general concept is used to present serial I/O as synchronous to the Python interpreter, when in reality the Web Serial API is entirely asynchronous.

Unfortunately, this project will only work with locally connected FPGAs, as browsers (understandably) won't let a webpage send arbitrary UDP packets to your local network.

This project should work on any platform that supports WebAssembly, the Web Serial API, and Service Workers. This seems to be mostly Chrome and Safari on Desktop, and Chrome for Android on mobile.

I'm working on bringing this to Manta's documentation site, but due to some nuances this is a bit easier said then done.
