from typing import IO
from flask import Flask, jsonify, request, abort, render_template, send_from_directory
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
    random_id = "RG123_2021"
    return render_template('base.html', model_name=model_name, filenames=filenames, models=models, random_id=random_id)


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


@app.route("/api/form-default-data/<random_id>/<model_name>")
def form_default_data(random_id: str, model_name: str):
    if not model_name:
        abort(404)
    rw = ReportWriter("./models", random_id=random_id, tempfolder=config.TEMPFOLDER)
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


@app.route("/api/model-instructions/<model_name>")
def model_instructions(model_name: str):
    rw = ReportWriter("./models", model_name=model_name)
    return jsonify({
        "html": rw.get_instructions_html()
    })


@app.route("/api/widget-asset/<random_id>/<field_name>/<path:relpath>")
def widget_asset(random_id: str, field_name: str, relpath: str):
    rw = ReportWriter("./models", random_id=random_id, tempfolder=config.TEMPFOLDER)
    path = rw.get_widget_asset(field_name, relpath)
    if path is None:
        return "file not found", 404
    return send_from_directory(path.parent, path.name)


@app.route("/api/widget-asset/<random_id>/<field_name>/<path:relpath>", methods=("DELETE",))
def delete_widget_asset(random_id: str, field_name: str, relpath: str):
    rw = ReportWriter("./models", random_id=random_id, tempfolder=config.TEMPFOLDER)
    try:
        rw.delete_widget_asset(field_name, relpath)
    except FileNotFoundError:
        return "file not found", 404
    return jsonify({"msg": "ok"})


@app.route("/api/upload-widget-assets/<random_id>/<widget_type>/<field_name>", methods=("POST",))
def upload_widget_assets(random_id: str, widget_type:str, field_name: str):
    rw = ReportWriter("./models", random_id=random_id, tempfolder=config.TEMPFOLDER)
    files = request.files.getlist("file[]")
    for f in files:
        data = rw.save_widget_asset(widget_type, field_name, f.stream, filename=f.filename)
    return jsonify({"msg": "ok"})

