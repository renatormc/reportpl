from typing import Any, Optional, Tuple

from click import option
from report_writer.types import ConverterType, ErrorsType, ValidatorType, WidgetAttributesType, ValidationError
import stringcase

class SelectWidget:

    def __init__(self, name: str,
                 label: str | None = None,
                 col: int = 0, default="",
                 options: list[str] = [],
                 validators: list[ValidatorType] = [],
                 converter: Optional[ConverterType] = None) -> None:
        self.name = name
        self.col = col
        self.default = default
        self.label = label or stringcase.capitalcase(name)
        self.validators = validators
        self.converter = converter
        self.options = options

    def convert_data(self, raw_data: Any) -> Tuple[Any, ErrorsType]:
        text = str(raw_data).strip()
        if self.required and text == "":
            return None, "Campo obrigatório"
        try:
            self.data = self.converter(text) if self.converter else text
        except ValidationError as e:
            return None, str(e)
        for v in self.validators:
            try:
                v(self.data)
            except ValidationError as e:
                return None, str(e)
        return self.data, None


    def get_layout(self) -> WidgetAttributesType:
        return {
            'field_name': self.name,
            'widget_type': "text_widget",
            'label': self.label,
            'col': self.col,
            'widget_props': {'placeholder': self.placeholder},
        }


    def get_default_data(self) -> Any:
        return self.default
