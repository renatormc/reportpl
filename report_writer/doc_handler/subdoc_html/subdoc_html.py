from typing import Any
from bs4 import BeautifulSoup
from docx import Document
from docxtpl import DocxTemplate, Subdoc
import jinja2
from report_writer.module_model import ModuleModel
from .elment_parses import parse_element


class SubdocHtmlFunction:
    def __init__(self, tpl: DocxTemplate, module_model: ModuleModel, jinja_env: jinja2.Environment):
        self.tpl = tpl
        self.module_model = module_model
        self.jinja_env = jinja_env

    def __call__(self, template: str, context: Any) -> Subdoc:
        if not isinstance(context, dict):
            context = {'data': context}
        sd = self.tpl.new_subdoc()
        path = self.module_model.html_templates_folder / template
        if not path.exists():
            raise FileNotFoundError(f"the template \"{path}\" was not found")
        tp = self.jinja_env.get_template(template)
        text = tp.render(**context)
        soup = BeautifulSoup(text, 'html.parser')
        for e in soup.find_all(recursive=False):
            parse_element(sd, e)
        return sd
