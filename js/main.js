async function main(data){
    let pyodide = await loadPyodide();

    // Load Manta.yaml into pyodide's file system
    pyodide.FS.writeFile("/manta.yaml", data, { encoding: "utf8" });

    // Load micropip, setuptools, manta
    await pyodide.loadPackage("micropip");
    await pyodide.loadPackage("setuptools");
    const micropip = pyodide.pyimport("micropip");
    await micropip.install('manta-1.0.0-py3-none-any.whl')

    pyodide.runPython(`
        import asyncio
        import time
        from js import read, write
        from manta.utils import value_to_words

        from manta import Manta
        m = Manta("/manta.yaml")
        print(m.my_io_core)

        async def set_probe(name, value):
            # Write value to core
            probe = m.my_io_core._memory_map.get(name)
            addrs = probe["addrs"]
            datas = value_to_words(value, len(addrs))
            for a, d in zip(addrs, datas):
                await write(a, d)

            # Pulse strobe register
            await write(m.my_io_core._base_addr, 0)
            await write(m.my_io_core._base_addr, 1)
            await write(m.my_io_core._base_addr, 0)

        async def foobar():
            for i in range(400):
                await set_probe(f"LED{i%4}", 1)
                time.sleep(0.2)
                await set_probe(f"LED{i%4}", 0)

        loop = asyncio.get_event_loop()
        loop.run_until_complete(foobar())
    `);
}