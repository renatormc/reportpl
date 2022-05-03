import argparse
from report_writer.api import run_app
from pathlib import Path
import shutil
from report_writer.api import config
import re

parser = argparse.ArgumentParser()
subparsers = parser.add_subparsers(dest="command", required=True, help='Command to be used')
parser.add_argument("-v", "--verbose", help="Verbose")

dev = subparsers.add_parser("dev")

copy_front = subparsers.add_parser("copy-front")
copy_front.add_argument("folder")


args = parser.parse_args()
if args.command == "dev":
    run_app()
elif args.command == "copy-front":
    folder_from = Path(args.folder) / "build/static"
    folder_to = config.api_dir / "static/front"
    try:
        shutil.rmtree(folder_to)
    except FileNotFoundError:
        pass
    shutil.copytree(folder_from, folder_to)
    







