from report_writer.types import ValidationError
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from report_writer.base_web_form import BaseWebForm


class IntConverter:
    def __init__(self) -> None:
        pass
    
    def __call__(self, form: 'BaseWebForm', value: str) -> int:
        try:
            return int(value)
        except:
            raise ValidationError("Valor incorreto")