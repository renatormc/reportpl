from typing import Any
from flask import Flask, jsonify, request, abort, render_template
from report_writer import ReportWriter, get_file_names
from report_writer.api import config
from report_writer.api.database import repo
from report_writer.types import ModelNotFoundError


app = Flask(__name__)


@app.route("/")
def index():
    model_name = request.args.get("model_name")
    filenames = get_file_names()
    rw = ReportWriter("./models")
    models = rw.list_models()
    return render_template('base.html', model_name=model_name, filenames=filenames, models=models)


@app.route("/api/form-layout/<model_name>")
def form_layout(model_name: str):
    if not model_name:
        abort(404)
    try:
        rw = ReportWriter("./models")
        rw.set_model(model_name)
    except ModelNotFoundError:
        abort(404)
    layout = rw.get_form_layout()
    return jsonify(layout)


@app.route("/api/form-default-data/<model_name>")
def form_default_data(model_name: str):
    if not model_name:
        abort(404)
    rw = ReportWriter("./models")
    rw.set_model(model_name)
    data = rw.get_default_data()
    return jsonify(data)


@app.route("/api/render-doc/<model_name>", methods=("POST",))
def render_doc(model_name: str):
    if not model_name:
        abort(404)
    rw = ReportWriter("./models")
    rw.set_model(model_name)
    json_data = request.json
    if not isinstance(json_data, dict):
        return "Incorrect data format", 401
    errors = rw.validate(json_data)
    print("Errors: ")
    print(errors)
    if errors:
        return jsonify(errors), 422
    print("\n\nContext: ")
    print(rw.context)
    rw.render_docx("./compilado.docx")
    return jsonify(errors)


@app.route("/api/list-items/<model_name>/<list_name>")
def list_items(model_name: str, list_name: str):
    q = request.args.get("query", default="")
    items = repo.search_list_items(model_name, list_name, q, limit=50)
    its = [{'key': item.key, 'value': item.value}
           for item in items] if items else []
    return jsonify(its)


# @app.route("/api/save-data")
# def save_data(model_name: str):
#     name_id = request.args.get("name_id")
#     if name_id is None:
#         return "No name_id was informed", 404
#     json_data = request.json
#     if not isinstance(json_data, dict):
#         return "Incorrect data format", 401
#     model_folder = config.saved_data_dir / model_name
#     try:
#         model_folder.mkdir()
#     except FileExistsError:
#         pass
#     path = model_folder / f""
