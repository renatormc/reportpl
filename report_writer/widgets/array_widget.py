from typing import Any, Optional, Tuple

from report_writer.widgets import Widget
from report_writer.types import ConverterType, ErrorsType, ValidatorType, WidgetAttributesType, ValidationError, WidgetMatrixType
import stringcase
from report_writer.widgets.composite_widget import CompositeWidget


class ArrayWidget:

    def __init__(self, name: str,
                 widgets: list[list[Widget]],
                 label: str | None = None,
                 col: int = 0,
                 required: bool = False,
                 validators: list[ValidatorType] = [],
                 converter: Optional[ConverterType] = None) -> None:
        self.name = name
        self.col = col
        self.required = required
        self.label = label or stringcase.capitalcase(name)
        self.validators = validators
        self.converter = converter
        self.widgets = widgets
        self.composite = CompositeWidget(self.widgets)

    def convert_data(self, raw_data: Any) -> Tuple[Any, ErrorsType]:
        data: Any = {}
        errors: dict = {}
        for i, item in enumerate(list(raw_data)):
            d, e = self.composite.convert_data(item)
            data[i] = d
            if e is not None:
                errors[i] = e
        return data, errors

    def get_layout(self) -> WidgetAttributesType:
        defaul_item_data = {}
        widgets: WidgetMatrixType = []
        for row in self.widgets:
            r: list[WidgetAttributesType] = []
            for w in row:
                defaul_item_data[w.name] = w.get_default_data()   
                r.append(w.get_layout())     
            widgets.append(r)
        return {
            'field_name': self.name,
            'widget_type': "array_widget",
            'label': self.label,
            'col': self.col,
            'widget_props': {
                'default_item_data': defaul_item_data,
                'widgets': widgets
                },
        }

    def get_default_data(self) -> Any:
        return []
