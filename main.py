from manta.cli import version
from manta import Manta

config = {
  "uart": {
    "baudrate": 115200,
    "port": "/dev/ttyUSB3",
    "clock_freq": 12000000
  },
  "cores": {
    "my_logic_analyzer": {
      "type": "logic_analyzer",
      "probes": {
        "probe0": 1,
        "probe1": 4,
        "probe2": 8
      },
      "sample_depth": 256,
      "triggers": [
        "probe2 EQ 3"
      ]
    }
  }
}

manta = Manta(config)

def capture(foo):
    print(f"(Python): capture() has been called with args: {foo}")
    cap = manta.my_logic_analyzer.capture()
    cap.export_vcd("/capture.vcd")

    with open("/capture.vcd", "r") as f:
        retval = f.read()

    print(f"(Python): capture() has completed and returned value: ", {retval})
    return retval

version()
print("Loaded Python!")