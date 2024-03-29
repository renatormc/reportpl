import os
from pathlib import Path
import tempfile

LIBDIR = Path(os.path.dirname(os.path.realpath(__file__)))
TEMPFOLDER = Path(tempfile.gettempdir(), "reportpl")
if not TEMPFOLDER.exists():
    TEMPFOLDER.mkdir()
MODELS_EXAMPLE_FOLDER = LIBDIR / "models_example"
MODELS_FOLDER = "./models"
LOCAL = False

def set_local(value: bool):
    global MODELS_FOLDER
    global LOCAL
    LOCAL = value
    if value:
        MODELS_FOLDER = str(LIBDIR.parent / "models")