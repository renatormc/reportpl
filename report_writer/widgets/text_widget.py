from typing import Any, Optional
from report_writer.types import ConverterType, ValidatorType, WidgetAttributesType, ValidationError
import stringcase


class TextWidget:

    def __init__(self, name: str,
                 label: str | None = None,
                 col: int = 0, default="",
                 placeholder: str = "",
                 required: bool = False,
                 validators: list[ValidatorType] = [],
                 converter: Optional[ConverterType] = None) -> None:
        self.name = name
        self.col = col
        self.default = default
        self.load(default)
        self.placeholder = placeholder
        self.required = required
        self.label = label or stringcase.capitalcase(name)
        self.validators = validators
        self.converter = converter

    def get_context(self) -> Any:
        text = self.raw_data.strip()
        if self.required and text == "":
            raise ValidationError("Campo obrigatório")
        self.data = self.converter(text) if self.converter else text
        for v in self.validators:
            v(self.data)
        return self.data

    def load(self, value: Any) -> None:
        self.raw_data = value
        self.data = self.raw_data

    def get_layout(self) -> WidgetAttributesType:
        return {
            'field_name': self.name,
            'widget_type': "text_widget",
            'label': self.label,
            'col': self.col,
            'widget_props': {'placeholder': self.placeholder},
        }

    # @property
    # def name(self) -> str:
    #     return self._name

    def get_default_data(self) -> Any:
        return self.default
