from report_writer.widgets import TextWidget, ArrayWidget, TextAreaWidget
from report_writer.types import ValidationError
from report_writer.web_converters import DateConverter, FloatConverter
from report_writer.base_web_form import BaseWebForm


def test_converter(value):
    try:
        parts = value.split("/")
        return {'seq': int(parts[0]), 'rg': int(parts[1]), 'ano': int(parts[2])}
    except:
        raise ValidationError("Valor incorreto")


class Form(BaseWebForm):

    def define_widgets(self):
        self.widgets = [
            [
                TextWidget(self, 'nome', default="", placeholder="Digite seu nome",required=True, converter=test_converter),
                TextWidget(self, 'endereco', label="Endereço",default="Danilo Januario"),
                TextWidget(self, 'data', label="Data",converter=DateConverter()),
                TextWidget(self, 'valor', label="Valor",converter=FloatConverter()),
            ],
            [
                ArrayWidget(self, "pessoas", widgets=[
                    [
                        TextWidget(self, 'nome', default="Nome default", placeholder="Digite seu nome",required=True),
                        TextWidget(self, 'profissao', label="Profissão",required=True),
                    ]
                ])
            ],
            [
                TextAreaWidget(self, 'texto_long',label='Texto longo', rows=10)
            ]
        ]