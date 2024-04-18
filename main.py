# import io
# import sys
# import traceback

import js

# def get_input():
#     result = js.getInput(sys.stdout.getvalue())
#     sys.stdout = sys.stderr = io.StringIO()
#     return result

# sys.stdin.readline = get_input

# def run_code(code):
#     sys.stdout = sys.stderr = io.StringIO()
#     try:
#         exec(code)
#     except:
#         traceback.print_exc()
#     return sys.stdout.getvalue()

# we actually don't need either of these functions but we'll leave them in for reference

def capture(foo):
    # in reality there will be lots more logic here, but this just makes something that's not
    # `write` that we can call from main
    print(f"(Python): capture() has been called with args: {foo}")
    foo = read(1)
    print(f"(Python): read() has completed and returned value: ", {foo})
    return foo

def read(n_bytes):
    return js.readSerial(n_bytes)


print("loaded python")