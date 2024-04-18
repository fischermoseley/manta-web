from js import workerReadSerial, workerWriteSerial

def capture(foo):
    print(f"(Python): capture() has been called with args: {foo}")
    foo = workerReadSerial(1)
    foo = workerReadSerial(1)
    foo = workerReadSerial(1)
    print(f"(Python): capture() has completed and returned value: ", {foo})
    return foo

print("Loaded Python!")