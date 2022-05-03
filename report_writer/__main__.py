import argparse
from report_writer.api import run_app, config
from pathlib import Path
import shutil
from report_writer.copy_spa import copy_spa

parser = argparse.ArgumentParser()
subparsers = parser.add_subparsers(dest="command", required=True, help='Command to be used')
parser.add_argument("-v", "--verbose", help="Verbose")

p_dev = subparsers.add_parser("dev")

p_copy_build = subparsers.add_parser("copy-build")
p_copy_build.add_argument("folder")

p_copy_spa = subparsers.add_parser("copy-spa")
p_copy_spa.add_argument("folder_to")


args = parser.parse_args()
if args.command == "dev":
    run_app()
elif args.command == "copy-build":
    folder_from = Path(args.folder) / "build/static"
    folder_to = config.api_dir / "static/front"
    try:
        shutil.rmtree(folder_to)
    except FileNotFoundError:
        pass
    shutil.copytree(folder_from, folder_to)
elif args.command == "copy-spa":
    copy_spa(args.folder_to)
    







