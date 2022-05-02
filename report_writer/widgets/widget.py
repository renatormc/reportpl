from typing import Any, Callable, Optional, Protocol

from report_writer.types import ConverterType, ValidatorType, WidgetAttributesType


class Widget(Protocol):

    validators: list[ValidatorType]
    converter: Optional[ConverterType]
    data: Any
    raw_data: Any
    col: int
    name: str

    def get_default_data(self) -> Any:
        pass

    def get_context(self) -> Any:
        pass

    def load(self, value: Any) -> None:
        pass

    def get_layout(self) -> WidgetAttributesType:
        pass

    # @property
    # def name(self) -> str:
    #     pass

