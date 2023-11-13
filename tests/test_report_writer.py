from reportpl import __version__
from reportpl import Reportpl
from reportpl import config as rplcfg

def test_version():
    assert __version__ == '0.1.0'

           
def test_form():
    rw = Reportpl(rplcfg.MODELS_FOLDER)

