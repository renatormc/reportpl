from pathlib import Path
from typing import Any, IO,  Optional, Protocol, Tuple, TYPE_CHECKING

if TYPE_CHECKING:
    from report_writer.base_web_form import BaseWebForm

from report_writer.types import ConverterType, ErrorsType, ValidatorType, WidgetAttributesType


class Widget(Protocol):

    validators: list[ValidatorType]
    converter: Optional[ConverterType]
    col: int
    name: str
    form: 'BaseWebForm'

    def get_default_data(self) -> Any:
        pass

    def convert_data(self, raw_data: Any) -> Tuple[Any, ErrorsType]:
        pass

    def get_layout(self) -> WidgetAttributesType:
        pass

    @staticmethod
    def save_widget_asset(widget_folder: Path, file: str | Path | IO[bytes], filename: str) -> Any:
        pass
