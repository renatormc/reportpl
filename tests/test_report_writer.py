from report_writer import __version__
from report_writer.widgets import __widgets__, TextWidget
import pytest

def test_version():
    assert __version__ == '0.1.0'

           

# def test_text_widget():
#     w = TextWidget("nome")
#     w.load("João Silva")
#     data = w.get_context()
#     assert data == "João Silva"

