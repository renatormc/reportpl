from pathlib import Path
from typing import Any, Optional, Tuple, Union
from importlib.machinery import SourceFileLoader
from .widgets import Widget
from .doc_handler import DocxHandler
from .html_render import render_pre_html
from .types import WidgetAttributesType, ValidationError
import json

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
    def __init__(self, models_folder: str | Path, model_name: str) -> None:
        self.model_name = model_name
        self.path = Path(models_folder) / model_name / "__init__.py"
        if not self.path.exists():
            raise Exception(f"Model \"{model_name}\" not found")
        self.module = SourceFileLoader(model_name, str(self.path)).load_module()

    def get_web_form(self) -> list[list[Widget]]:
        return self.module.web_form.widgets


class ReportWriter:
    def __init__(self, models_folder: str | Path) -> None:
        self.models_folder = Path(models_folder)
        self._current_module_model: None | ModuleModel = None
        self._context: dict| None = None

    @property
    def current_module_model(self) -> ModuleModel:
        if self._current_module_model is None:
            raise Exception("current_module_model must was not initialized")
        return self._current_module_model

    @property
    def context(self) -> dict:
        if self._context is None:
            raise Exception("validate was not called")
        return self._context

    def set_model(self, model_name: str) -> None:
        self._current_module_model = ModuleModel(self.models_folder, model_name)

    def get_form_layout(self) -> list[list[WidgetAttributesType]]:
        """Return the layout description of the form in a json form"""
        widgets = self.current_module_model.get_web_form()
        return [[w.get_layout() for w in row] for row in widgets]

    def get_default_data(self) -> dict[str, Any]:
        data = {}
        for row in self.current_module_model.get_web_form():
            for w in row:
                data[w.name] = w.get_default_data()
        return data

    def render_docx(self, dest_file: str | Path) -> Tuple[Any, Optional[Path]]:
        """Render the docx document in the path specified on dest_file param
        Returns a tuple (context, file_renderized)"""
        r = Renderer(self.current_module_model.module)
        return r.render(self.context, dest_file)

    def validate(self,  data: dict) -> dict:
        """Receive data serialized, validate and convert types
        Returns errors"""
        self._context = {}
        errors = {}
        for row in self.current_module_model.get_web_form():
            for w in row:
                try:
                    w.load(data[w.name])
                    self._context[w.name] = w.get_context()
                except KeyError:
                    errors[w.name] = "not found"
                except ValidationError as e:
                    message = str(e)
                    errors[w.name] = message
        return errors

    def save_data_to_file(self, data: dict, path: str | Path) -> None:
        path = Path(path)
        with path.open("w", encoding="utf-8") as f:
            f.write(json.dumps(data, ensure_ascii=False, indent=4))

    def load_data_from_file(self, path: str | Path) -> dict:
        path = Path(path)
        with path.open("r", encoding="utf-8") as f:
            data = json.load(f)
        return data
