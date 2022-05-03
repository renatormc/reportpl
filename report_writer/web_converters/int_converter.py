from report_writer.types import ValidationError

class IntConverter:
    def __init__(self) -> None:
        pass
    
    def __call__(self, value: str) -> int:
        try:
            return int(value)
        except:
            raise ValidationError("Valor incorreto")