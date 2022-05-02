from datetime import datetime
from report_writer.types import ValidationError

class DateConverter:
    def __init__(self, format="%d/%m/%Y") -> None:
        self.format = format

    def __call__(self, value: str) -> datetime:
        try:
            return datetime.strptime(value, self.format)
        except:
            raise ValidationError("Data inválida")