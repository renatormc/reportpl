from pathlib import Path
from typing import Any, Optional, Tuple, Union

from .widgets import BaseWidget
from .doc_handler import DocxHandler
from .html_render import render_pre_html
from .types import FormLayoutItem, ValidationError

class Renderer:
    def __init__(self, model):
        self.model = model
        self.model_folder = Path(model.__file__).parent
     

    def pre(self, context):
        self.model.pre.pre(context)
              

    def render(self, context, dest_file: Union[Path, str], type_="docx") -> Tuple[Any, Optional[Path]]:
        self.pre(context)
        render_pre_html(self.model, context)
        self.engine = DocxHandler(self.model)
        return context, self.engine.render("Main.docx", context, dest_file)
       

class ReportWriter:
    def __init__(self, models_folder: str|Path) -> None:
        self.models_folder = Path(models_folder)

    def __get_widgets(self, widget_name: str) -> list[list[BaseWidget]]:
        return []

    def get_form_layout(self, model_name: str) -> list[list[FormLayoutItem]]:
        """Return the layout description of the form in a json form"""
        widgets = self.__get_widgets(model_name)
        return [[{'field_name': w.name, 'widget_type': w.widget_type} for w in row] for row in widgets]

    def get_default_data(self, model_name: str) -> dict[str, Any]:
        widgets = self.__get_widgets(model_name)
        data = {}
        for row in widgets:
            for w in row:
                data[w.name] = w.get_default_serialized_data()
        return data
        

    def render_docx(self, model_name: str, dest_file: str|Path, context) -> Tuple[Any, Optional[Path]]:
        """Render the docx document in the path specified on dest_file param
        Returns a tuple (context, file_renderized)"""
        r = Renderer()
        return r.render(context, dest_file)

    def parse_data(self, model_name: str, data: list[dict]) -> Tuple[dict, dict]:
        """Receive data serialized, validate and convert types
        Returns errors and data parsed"""
        context = {}
        errors = {}
        for row in self.__get_widgets(model_name):
            for w in row:
                try:
                    w.load(data[w.name])
                    context[w.name] = w.get_context()
                except KeyError:
                    errors[w.name] = "not found"
                except ValidationError as e:
                    message = str(e)
                    errors[w.name] = message
        return errors, context