from typing import Any
from flask import Flask, jsonify, request, abort
from report_writer import ReportWriter

app = Flask(__name__)


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
    if errors:
        return jsonify(errors), 422
    return jsonify(errors)