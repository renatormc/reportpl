from typing import Any
from flask import Flask, jsonify, request, abort, render_template
from report_writer import ReportWriter, get_file_names
from report_writer.api import config
from report_writer.api

app = Flask(__name__)


@app.route("/<model_name>")
def index(model_name: str):
    filenames = get_file_names()
    return render_template('base.html', model_name=model_name, filenames=filenames)


@app.route("/api/form-layout/<model_name>")
def form_layout(model_name: str):
    if not model_name:
        abort(404)
    rw = ReportWriter("./models")
    rw.set_model(model_name)
    data = rw.get_form_layout()
    return jsonify(data)


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
