from typing import Any,  Optional, Protocol, Tuple

from report_writer.types import ConverterType, ErrorsType, ValidatorType, WidgetAttributesType


class Widget(Protocol):

    validators: list[ValidatorType]
    converter: Optional[ConverterType]
    col: int
    name: str

    def get_default_data(self) -> Any:
        pass

    def convert_data(self, raw_data: Any) -> Tuple[Any, ErrorsType]:
        pass

    def get_layout(self) -> WidgetAttributesType:
        pass


