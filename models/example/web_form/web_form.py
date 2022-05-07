from report_writer.widgets import TextWidget, ArrayWidget, TextAreaWidget, TypeAheadObjWidget
from report_writer.types import ValidationError
from report_writer.web_converters import DateConverter, FloatConverter
from report_writer.base_web_form import BaseWebForm



class Form(BaseWebForm):
    
    def define_widgets(self):
        self.widgets = [
            [
                TextWidget(self, 'nome', default="", placeholder="Digite seu nome",required=True),
                TextWidget(self, 'date', label="Data",converter=DateConverter()),
                TextWidget(self, 'float_value', label="Valor flutuante",converter=FloatConverter()),
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
            ],
            [
                TypeAheadObjWidget(self, 'test_typeahead', options='cidades', label='Typeahead')
            ]
        ]