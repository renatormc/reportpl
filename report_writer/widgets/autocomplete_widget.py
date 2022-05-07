from typing import Any, Optional, Tuple
from report_writer.types import ConverterType, ErrorsType, ValidatorType, WidgetAttributesType, ValidationError
import stringcase


class AutoCompleteWidget:

    def __init__(self, name: str,
                 list_name: str,
                 label: str | None = None,
                 col: int = 0, default="",
                 placeholder: str = "",
                 required: bool = False,
                 validators: list[ValidatorType] = [],
                 converter: Optional[ConverterType] = None,
                 mincars: int = 1) -> None:
        self.name = name
        self.list_name = list_name
        self.col = col
        self.default = default
        self.placeholder = placeholder
        self.required = required
        self.label = label or stringcase.capitalcase(name)
        self.validators = validators
        self.converter = converter
        self.mincars = mincars

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
            'widget_type': "autocomplete_widget",
            'label': self.label,
            'col': self.col,
            'widget_props': {
                'placeholder': self.placeholder,
                'list_name': self.list_name,
                'mincars': self.mincars
            },
        }

    def get_default_data(self) -> Any:
        return self.default
