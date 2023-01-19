from reportpl import __version__
from reportpl import ReportWriter
import pytest

def test_version():
    assert __version__ == '0.1.0'

           
def test_form():
    rw = ReportWriter("./models")

