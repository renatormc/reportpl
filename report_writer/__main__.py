import argparse
from report_writer.api import run_app, config
from pathlib import Path
import shutil
from report_writer.copy_spa import copy_spa
import os

script_dir =  Path(os.path.dirname(os.path.realpath(__file__)))

parser = argparse.ArgumentParser()
subparsers = parser.add_subparsers(dest="command", required=True, help='Command to be used')
parser.add_argument("-v", "--verbose", help="Verbose")

p_dev = subparsers.add_parser("dev")

# p_copy_build = subparsers.add_parser("copy-build")
# p_copy_build.add_argument("folder")

p_copy_spa = subparsers.add_parser("copy-spa")
p_copy_spa.add_argument("folder_to")

p_build_spa = subparsers.add_parser("build-spa")

args = parser.parse_args()
if args.command == "dev":
    run_app()
# elif args.command == "copy-build":
#     folder_from = Path(args.folder) / "build/static"
#     folder_to = config.api_dir / "static/front"
#     try:
#         shutil.rmtree(folder_to)
#     except FileNotFoundError:
#         pass
#     shutil.copytree(folder_from, folder_to)
elif args.command == "copy-spa":
    copy_spa(args.folder_to)
elif args.command == "build-spa":
    os.chdir(script_dir.parent / "form")
    os.system("yarn build")
    folder_from = script_dir.parent / "form/build/static"
    folder_to = config.api_dir / "static/front"
    try:
        shutil.rmtree(folder_to)
    except FileNotFoundError:
        pass
    shutil.copytree(folder_from, folder_to)
    







