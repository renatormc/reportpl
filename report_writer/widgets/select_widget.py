from typing import Any, Optional, Tuple

from click import option
from report_writer.types import ConverterType, ErrorsType, ModelListItem, ValidatorType, WidgetAttributesType, ValidationError
import stringcase

class SelectWidget:

    def __init__(self, name: str,
                 label: str | None = None,
                 col: int = 0, default="",
                 options: list[str]|list[ModelListItem] = [],
                 validators: list[ValidatorType] = [],
                 converter: Optional[ConverterType] = None) -> None:
        self.name = name
        self.col = col
        self.default = default
        self.label = label or stringcase.capitalcase(name)
        self.validators = validators
        self.converter = converter
        self.options = [self._convert_item_list(item) for item in options]

    def _convert_item_list(self, item) -> ModelListItem:
        if isinstance(item, str):
            return {'key': item, 'value': item}
        return item

    def convert_data(self, raw_data: Any) -> Tuple[Any, ErrorsType]:
        try:
            self.data = self.converter(raw_data) if self.converter else raw_data
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
            'widget_type': "select_widget",
            'label': self.label,
            'col': self.col,
            'widget_props': {'options': self.options},
        }


    def get_default_data(self) -> Any:
        return self.default
