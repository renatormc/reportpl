from pathlib import Path
from typing import Optional, Union
from docxtpl import DocxTemplate, InlineImage
from docxtpl.subdoc import Subdoc
from report_writer.doc_handler.jenv import make_jinja_env
from docx.shared import Mm
from uuid import uuid4
from report_writer.doc_handler.subdoc_html import SubdocHtmlFunction
from report_writer.module_model import ModuleModel


class SubdocFunction:
    def __init__(self, tpl, module_model: ModuleModel):
        self.tpl = tpl
        self.module_model = module_model

    def __call__(self, template, context):
        if not isinstance(context, dict):
            context = {'data': context}
        path = self.module_model.docx_templates_folder / f"{template}.docx"
        if not path.exists():
            print(f"Não foi encontrado o arquivo {path}")
            return
        subtpl = DocxTemplate(str(path))
        subtpl.render(context)
        sd: Subdoc = self.tpl.new_subdoc()
        sd.subdocx = subtpl.docx
        return sd


class SInlineImage:
    def __init__(self, tpl):
        self.tpl = tpl

    def __call__(self, file, width):
        path = Path(file)
        if not path.exists():
            return
        return InlineImage(self.tpl, file, width=Mm(width))


class DocxHandler:
    def __init__(self, module_model: ModuleModel):
        self.module_model = module_model
        self.templates_folder = self.module_model.docx_templates_folder
        self.jinja_env = make_jinja_env(self.module_model)

    def prepare_jinja_env(self, tpl: DocxTemplate):
        self.jinja_env.globals['subdoc'] = SubdocFunction(tpl, self.module_model)
        jinja_env2 = make_jinja_env(self.module_model, self.module_model.html_templates_folder)
        self.jinja_env.globals['subdoc_html'] = SubdocHtmlFunction(tpl, self.module_model, jinja_env2)
        self.jinja_env.globals['image'] = SInlineImage(tpl)
        return self.jinja_env

    def render_temp(self, template, context):
        path = self.templates_folder / template
        if path.exists():
            tpl = DocxTemplate(str(path))
            jinja_env = self.make_jinja_env(tpl)
            tpl.render(context, jinja_env)
            tempfile = self.TEMPFOLDER / f"{uuid4()}.docx"
            tpl.save(tempfile)
            return tempfile

    def render(self, template: str, context, dest_file: Union[Path, str]) -> Optional[Path]:
        dest_file = Path(dest_file)
        path = self.templates_folder / template
        if path.exists():
            tpl = DocxTemplate(str(path))
            jinja_env = self.prepare_jinja_env(tpl)
            tpl.render(context, jinja_env)
            tpl.save(dest_file)
            return dest_file
        return None
