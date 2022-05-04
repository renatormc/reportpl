from pathlib import Path
import os

api_dir = Path(os.path.dirname(os.path.realpath(__file__)))

DEBUG = True

# local_folder = api_dir.parent.parent / ".local"
# try:
#     local_folder.mkdir()
# except FileExistsError:
#     pass

# saved_data_dir = local_folder / "saved_data"
# try:
#     saved_data_dir.mkdir()
# except FileExistsError:
#     pass