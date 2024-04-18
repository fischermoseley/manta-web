import io
import sys
import traceback

import js

def get_input():
    result = js.getInput(sys.stdout.getvalue())
    sys.stdout = sys.stderr = io.StringIO()
    return result

sys.stdin.readline = get_input

def run_code(code):
    sys.stdout = sys.stderr = io.StringIO()
    try:
        exec(code)
    except:
        traceback.print_exc()
    return sys.stdout.getvalue()

print("loaded python")

