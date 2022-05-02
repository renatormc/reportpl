from report_writer.types import ValidationError

class FloatConverter:
    def __init__(self, decimal_separator=",") -> None:
        self.decimal_separator = decimal_separator

    def __call__(self, value: str) -> float:
        try:
            return float(value.replace(",", "."))
        except:
            raise ValidationError("Valor incorreto")