from report_writer.widgets import TextWidget, Widget
from report_writer.types import ValidationError
from report_writer.widgets.array_widget import ArrayWidget
from report_writer.web_converters import DateConverter, FloatConverter


def test_converter(value):
    try:
        parts = value.split("/")
        return {'seq': int(parts[0]), 'rg': int(parts[1]), 'ano': int(parts[2])}
    except:
        raise ValidationError("Valor incorreto")


widgets: list[list[Widget]] = [
    [
        TextWidget('nome', default="", placeholder="Digite seu nome",
                   required=True, converter=test_converter),
        TextWidget('endereco', label="Endereço", default="Danilo Januario"),
        TextWidget('data', label="Data", converter=DateConverter()),
        TextWidget('valor', label="Valor", converter=FloatConverter()),
    ],
    [
        ArrayWidget("pessoas", widgets=[
            [
                TextWidget('nome', default="Nome default", placeholder="Digite seu nome",
                           required=True),
                TextWidget('profissao', label="Profissão", required=True),
            ]
        ])
    ]
]
