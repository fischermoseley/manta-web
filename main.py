from manta.cli import version
from manta import Manta
import yaml

manta = None

def load_config_file(yaml_string):
  config = yaml.safe_load(yaml_string)
  global manta
  manta = Manta.from_config_dict(config)

def capture(foo):
    print(f"(Python): capture() has been called with args: {foo}")
    cap = manta.cores.my_logic_analyzer.capture()
    cap.export_vcd("/capture.vcd")

    with open("/capture.vcd", "r") as f:
        retval = f.read()

    print(f"(Python): capture() has completed and returned value: ", {retval})
    return retval

version()
print("Loaded Python!")