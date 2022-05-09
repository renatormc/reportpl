import argparse
from report_writer.api import run_app, config
from pathlib import Path
import shutil
from report_writer.copy_spa import copy_spa
import os
import subprocess
import json
from report_writer.api.helpers import reacreate_db, ReportWriter
import sys

script_dir =  Path(os.path.dirname(os.path.realpath(__file__)))

parser = argparse.ArgumentParser()
subparsers = parser.add_subparsers(dest="command", required=True, help='Command to be used')
parser.add_argument("-v", "--verbose", help="Verbose")

p_dev = subparsers.add_parser("dev")
p_dev.add_argument("--no-build-db", action="store_true", help="Do not recreate the dev db")

p_copy_spa = subparsers.add_parser("copy-spa")
p_copy_spa.add_argument("folder_to")

p_build_spa = subparsers.add_parser("build-spa")

p_update = subparsers.add_parser("update")
p_update.add_argument("branch")

p_export_model = subparsers.add_parser("export-model")
p_export_model.add_argument("model_name")
p_export_model.add_argument("zipfile")

p_import_model = subparsers.add_parser("import-model")
p_import_model.add_argument("zipfile")

p_delete_model = subparsers.add_parser("delete-model")
p_delete_model.add_argument("model_name")

args = parser.parse_args()
if args.command == "dev":
    if not args.no_build_db:
        reacreate_db()
    run_app()
elif args.command == "copy-spa":
    copy_spa(args.folder_to)
elif args.command == "build-spa":
    os.chdir(script_dir.parent / "form")
    subprocess.check_call(["yarn", "build"])
    folder_from = script_dir.parent / "form/build/static"
    folder_to = config.api_dir / "static/front"
    try:
        shutil.rmtree(folder_to)
    except FileNotFoundError:
        pass
    shutil.copytree(folder_from, folder_to)
    
    filenames = {}
    for entry in (folder_to / "css").iterdir():
        name = entry.name
        if name.startswith("main.") and name.endswith(".css"):
            filenames['css_filename'] = name
    for entry in (folder_to / "js").iterdir():
        name = entry.name
        if name.startswith("main.") and name.endswith(".js"):
            filenames['js_filename'] = name
    with (folder_to / "filenames.json").open("w", encoding="utf-8") as f:
        f.write(json.dumps(filenames, ensure_ascii=False, indent=4))
elif args.command == "update":
    path = Path(sys.executable).parent.parent / "src/report-writer"
    os.chdir(path)
    os.system("git reset --hard")
    os.system(f"git checkout {args.branch}")
    os.system(f"git pull origin {args.branch}")
elif args.command == "export-model":
    rw = ReportWriter("./models")
    rw.set_model(args.model_name)
    rw.export_model(args.zipfile)
elif args.command == "import-model":
    rw = ReportWriter("./models")
    rw.import_model(args.zipfile)
elif args.command == "delete-model":
    rw = ReportWriter("./models")
    rw.delete_model(args.model_name)






