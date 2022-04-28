from pathlib import Path
from shutil import ExecError
from typing import Any, Optional, Tuple, Union
from importlib.machinery import SourceFileLoader
from .widgets import Widget
from .doc_handler import DocxHandler
from .html_render import render_pre_html
from .types import FormLayoutItem, ValidationError
import importlib

__version__ = '0.1.0'

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


class ModuleModel:
    def __init__(self, models_folder: str|Path, model_name: str) -> None:
        self.model_name = model_name
        self.path = Path(models_folder) / model_name / "__init__.py"
        if not self.path.exists():
            raise Exception(f"Model \"{model_name}\" not found")
        self.module = SourceFileLoader(model_name, str(self.path)).load_module()
        

    def get_web_form(self) -> list[list[Widget]]:
        return self.module.web_form.widgets
       

class ReportWriter:
    def __init__(self, models_folder: str|Path) -> None:
        self.models_folder = Path(models_folder)
        self._current_module_model: None|ModuleModel =  None

    @property
    def current_module_model(self) -> ModuleModel:
        if self._current_module_model is None:
            raise Exception("current_module_model must was not initialized")
        return self._current_module_model

    def set_model(self, model_name: str) -> None:
        self._current_module_model =  ModuleModel(self.models_folder, model_name)


    def get_form_layout(self) -> list[list[FormLayoutItem]]:
        """Return the layout description of the form in a json form"""
        widgets = self.current_module_model.get_web_form()
        return [[{'field_name': w.name, 'widget_type': w.widget_type} for w in row] for row in widgets]


    def get_default_data(self) -> dict[str, Any]:
        data = {}
        for row in self.current_module_model.get_web_form():
            for w in row:
                data[w.name] = w.get_default_serialized_data()
        return data
        

    def render_docx(self, dest_file: str|Path, context) -> Tuple[Any, Optional[Path]]:
        """Render the docx document in the path specified on dest_file param
        Returns a tuple (context, file_renderized)"""
        r = Renderer(self.current_module_model.module)
        return r.render(context, dest_file)

    def parse_data(self,  data: dict[str, Any]) -> Tuple[dict, dict]:
        """Receive data serialized, validate and convert types
        Returns errors and data parsed"""
        context = {}
        errors = {}
        for row in self.current_module_model.get_web_form():
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