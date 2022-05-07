from typing import Any, Optional, Tuple, TYPE_CHECKING
if TYPE_CHECKING:
    from report_writer.base_web_form import BaseWebForm
from report_writer.types import ConverterType, ErrorsType, ModelListItem, ValidatorType, WidgetAttributesType, ValidationError
import stringcase


class TypeAheadObjWidget:

    def __init__(self, form: 'BaseWebForm',
                 name: str,
                 options: str | list[str] | list[ModelListItem],
                 label: str | None = None,
                 col: int = 0,
                 default: Any = None,
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
        self.list_name: str = str(self.options) if self.ajax else ""

    def convert_data(self, raw_data: Any) -> Tuple[Any, ErrorsType]:
        print(type(raw_data))
        if raw_data is None:
            return None, "Valor incorreto"
        text = str(raw_data).strip()
        if self.required and text == "":
            return None, "Campo obrigatório"
        try:
            self.data = self.converter(self.form, text) if self.converter else text
        except ValidationError as e:
            return None, str(e)
        for v in self.validators:
            try:
                v(self.form, self.data)
            except ValidationError as e:
                return None, str(e)
        return self.data, None

    def _convert_item_list(self, item) -> ModelListItem:
        if isinstance(item, str):
            return {'key': item, 'value': item}
        return item

    def get_layout(self) -> WidgetAttributesType:
        options = [] if self.ajax else [self._convert_item_list(item) for item in self.options]
        print(options)
        return {
            'field_name': self.name,
            'widget_type': "typeahead_obj_widget",
            'label': self.label,
            'col': self.col,
            'widget_props': {
                'placeholder': self.placeholder,
                'options': options,
                'ajax': self.ajax,
                'list_name': self.list_name
            },
        }

    def get_default_data(self) -> Any:
        return self.default
