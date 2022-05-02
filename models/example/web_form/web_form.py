from report_writer.widgets import TextWidget, Widget
from report_writer.types import ValidationError

def test_converter(value):
    try:
        parts = value.split("/")
        return {'seq': int(parts[0]), 'rg': int(parts[1]), 'ano': int(parts[2])}
    except:
        raise ValidationError("Valor incorreto")

widgets: list[list[Widget]] = [
    [
        TextWidget('nome', default="", placeholder="Digite seu nome", required=True, converter=test_converter),
        TextWidget('endereco', label="Endereço", default="Danilo Januario"),
    ]
]