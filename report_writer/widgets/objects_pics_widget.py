from shutil import copyfileobj
from typing import IO, Any, Optional, Tuple, TYPE_CHECKING, TypedDict

from pathlib import Path

from report_writer.zipmodel import unzip_file
if TYPE_CHECKING:
    from report_writer.base_web_form import BaseWebForm
from report_writer.types import ConverterType, ErrorsType, ValidatorType, WidgetAttributesType, ValidationError
import stringcase


class ObjectData(TypedDict):
    name: str
    pics: list[str]


class ObjectsPicsData(TypedDict):
    not_classified: list[str]
    objects: list[ObjectData]


class ObjectsPicsWidget:

    def __init__(self, form: 'BaseWebForm',
                 name: str,
                 label: str | None = None,
                 col: int = 0,
                 validators: list[ValidatorType] = [],
                 converter: Optional[ConverterType] = None) -> None:
        self.col = col
        self.form = form
        self.name = name
        self.label = label or stringcase.capitalcase(name)
        self.validators = validators
        self.converter = converter

    @staticmethod
    def get_data_from_folder(widget_folder: Path) -> Any:
        folder2 = widget_folder / "not_classified"
        try:
            folder2.mkdir()
        except FileExistsError:
            pass
        pics = [
            f"not_classified/{e.name}" for e in folder2.iterdir() if e.is_file()]
        objs: list[ObjectData] = []
        folder2 = widget_folder / "objects"
        try:
            folder2.mkdir()
        except FileExistsError:
            pass
        for entry in folder2.iterdir():
            if entry.is_file():
                continue
            objdata: ObjectData = {
                'name': entry.name,
                'pics': [f"objects/{entry.name}/{e.name}" for e in entry.iterdir() if e.is_file()]
            }
            objs.append(objdata)
        return {
            "not_classified": pics,
            "objects": objs
        }

    @staticmethod
    def save_widget_asset(widget_folder: Path, file: Path | str | IO[bytes], filename: str) -> Any:
        folder = widget_folder / "not_classified"
        path = folder / filename
        if isinstance(file, (str, Path)):
            file = Path(file).open("wb")
        with path.open("wb") as fd:
            copyfileobj(file, fd)
        return ObjectsPicsWidget.get_data_from_folder(widget_folder)

    def convert_data(self, raw_data: Any) -> Tuple[Any, ErrorsType]:
        d: ObjectsPicsData = raw_data
        folder = self.form.report_writer.get_widget_assets_folder(
            self.name, create=True)

        data: ObjectsPicsData = {
            "not_classified": [],
            "objects": []
        }
        for item in d['not_classified']:
            path = folder / "not_classified" / item
            if not path.exists():
                return None, f"file \"{item}\" not found"
            data["not_classified"].append(str(path))
        for i, obj in enumerate(d['objects']):
            obj_folder = folder / "objects" / f"{i + 1}"
            objdata: ObjectData = {"name": obj["name"], "pics": []}
            for item in obj:
                path = obj_folder / item
                if not path.exists():
                    return None, f"file \"{item}\" not found"
                objdata["pics"].append(str(path))
            data["objects"].append(objdata)
        try:
            self.data = self.converter(
                self.form, data) if self.converter else data
        except ValidationError as e:
            return None, str(e)
        for v in self.validators:
            try:
                v(self.form, self.data)
            except ValidationError as e:
                return None, str(e)
        return self.data, None

    def get_layout(self) -> WidgetAttributesType:
        return {
            'field_name': self.name,
            'widget_type': "objects_pics_widget",
            'label': self.label,
            'col': self.col,
            'widget_props': {},
        }

    def get_default_data(self) -> ObjectsPicsData:
        folder = self.form.report_writer.get_widget_assets_folder(
            self.name, create=True)
        return self.get_data_from_folder(folder)
