from typing import Any, Optional, Tuple, TYPE_CHECKING
if TYPE_CHECKING:
    from report_writer.base_web_form import BaseWebForm
from report_writer.types import ConverterType, ErrorsType, ModelListItem, ValidatorType, WidgetAttributesType, ValidationError
import stringcase


class TypeAheadWidget:

    def __init__(self, form: 'BaseWebForm',
                 name: str,
                 options: list[str] | list[ModelListItem],
                 label: str | None = None,
                 col: int = 0, default="",
                 placeholder: str = "",
                 required: bool = False,
                 validators: list[ValidatorType] = [],
                 converter: Optional[ConverterType] = None) -> None:
        self.form = form
        self.name = name
        self.options = options
        self.ajax = isinstance(self.options, str)
        self.col = col
        self.default = default
        self.placeholder = placeholder
        self.required = required
        self.label = label or stringcase.capitalcase(name)
        self.validators = validators
        self.converter = converter

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
            'widget_props': {
                'placeholder': self.placeholder,
                'options': self.options
            },
        }

    def get_default_data(self) -> Any:
        return self.default
