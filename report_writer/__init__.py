from pathlib import Path
from typing import Any, Optional, Tuple, Type, Union
from importlib.machinery import SourceFileLoader
from report_writer.base_web_form import BaseWebForm

from report_writer.widgets.composite_widget import CompositeWidget
from .widgets import Widget
from .doc_handler import DocxHandler
from .html_render import render_pre_html
from .types import ErrorsType, ModelList, ModelListItem, WidgetAttributesType
import json
import json
import os

__version__ = '0.1.1'

script_dir = Path(os.path.dirname(os.path.realpath(__file__)))


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
        self.module = SourceFileLoader(
            model_name, str(self.path)).load_module()

    def get_web_form(self) -> BaseWebForm:
        return self.module.web_form.Form()


class ReportWriter:
    def __init__(self, models_folder: str | Path) -> None:
        self.models_folder = Path(models_folder)
        self._current_module_model: None | ModuleModel = None
        self._current_model_folder: Path | None = None
        self._context: dict | None = None

    @property
    def current_model_folder(self) -> Path:
        if self._current_model_folder is None:
            raise Exception("current_module_model must was not initialized")
        return self._current_model_folder

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

    def list_models(self) -> list[str]:
        return [entry.name for entry in self.models_folder.iterdir() if entry.is_dir()]

    def set_model(self, model_name: str) -> None:
        self._current_model_folder = self.models_folder / model_name
        self._current_module_model = ModuleModel(
            self.models_folder, model_name)

    def get_form_layout(self) -> list[list[WidgetAttributesType]]:
        """Return the layout description of the form in a json form"""
        form = self.current_module_model.get_web_form()
        form.define_widgets()
        widgets = form.widgets
        return [[w.get_layout() for w in row] for row in widgets]

    def get_default_data(self) -> dict[str, Any]:
        form = self.current_module_model.get_web_form()
        form.define_widgets()
        data = {}
        for row in form.widgets:
            for w in row:
                data[w.name] = w.get_default_data()
        return data

    def render_docx(self, dest_file: str | Path) -> Tuple[Any, Optional[Path]]:
        """Render the docx document in the path specified on dest_file param
        Returns a tuple (context, file_renderized)"""
        r = Renderer(self.current_module_model.module)
        return r.render(self.context, dest_file)

    def validate(self,  data: dict) -> ErrorsType:
        """Receive data serialized, validate and convert types
        Returns errors"""
        form = self.current_module_model.get_web_form()
        form.define_widgets()
        widgets = form.widgets
        composite = CompositeWidget(widgets)
        self._context, errors = composite.convert_data(data)
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

    def get_lists(self) -> list[ModelList]:
        folder = self.current_model_folder / "lists"
        lists: list[ModelList] = []
        if folder.exists():
            for entry in folder.iterdir():
                if entry.is_dir():
                    continue
                l: ModelList = {'name': entry.stem, 'items': []}
                if entry.suffix == ".txt":
                    text = entry.read_text(encoding="utf-8")
                    lines = text.split("\n")
                    l["items"] = [{'key': line, 'value': line}
                                  for line in lines]
                elif entry.suffix == ".json":
                    with entry.open("r", encoding="utf-8") as f:
                        l["items"] = json.load(f)
                lists.append(l)
        return lists


def get_file_names() -> dict[str, str]:
    folder = script_dir / "api/static/front"
    with (folder / "filenames.json").open("r", encoding="utf-8") as f:
        data = json.load(f)
    return data
