from pathlib import Path
import os
import tempfile

api_dir = Path(os.path.dirname(os.path.realpath(__file__)))

TEMPFOLDER = Path(tempfile.gettempdir(), "report_writer")
if not TEMPFOLDER.exists():
    TEMPFOLDER.mkdir()

DEBUG = True

DBFILE = TEMPFOLDER / 'db.db'
DATABASE_URI = f"sqlite:///{DBFILE}"