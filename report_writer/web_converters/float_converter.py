from report_writer.types import ValidationError
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from report_writer.base_web_form import BaseWebForm

class FloatConverter:
    def __init__(self, decimal_separator=",") -> None:
        self.decimal_separator = decimal_separator

    def __call__(self, form: 'BaseWebForm', value: str) -> float:
        try:
            return float(value.replace(",", "."))
        except:
            raise ValidationError("Valor incorreto")