async function main(data){
    let pyodide = await loadPyodide();

    // Load Manta.yaml into pyodide's file system
    // pyodide.FS.writeFile("/hello.txt", data, { encoding: "utf8" });
    pyodide.FS.writeFile("/manta.yaml", data, { encoding: "utf8" });

    // Load micropip, setuptools, manta
    await pyodide.loadPackage("micropip");
    await pyodide.loadPackage("setuptools");
    const micropip = pyodide.pyimport("micropip");
    await micropip.install('manta-1.0.0-py3-none-any.whl')

    pyodide.runPythonAsync(`
        from js import connect, read, write
        write(0,0)
        # await write(1, 1)
        # await write(0, 1)
        # await write(0, 0)
        # from manta import Manta
        # m = Manta("/manta.yaml")
        # print(m.my_io_core)

    `);
}