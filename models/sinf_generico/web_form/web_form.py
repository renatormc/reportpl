from report_writer.base_web_form import BaseWebForm
from report_writer.widgets import TextWidget, ObjectsPicsWidget, TypeAheadWidget
from report_writer.types import ValidationError
from report_writer.web_converters import DateConverter, PathConverter

def convert_pericia(form, value):
    parts = value.split("/")
    return {"seq": int(parts[0]), "rg": int(parts[1]), "ano": int(parts[2])}


def convert_relatores(form, value):
    return [item.strip() for item in value.split(",")]

class Form(BaseWebForm):

    def define_widgets(self):

        self.widgets = [
            [
                TextWidget(self, 'pericia', label="Perícia", required=True, converter=convert_pericia),
                TextWidget(self,'requisitante', label="Requisitante", required=True),
                TextWidget(self,'procedimento', label="Procedimento"),
                TextWidget(self,'ocorrencia_odin', label="Ocorrência ODIN")
            ],
            [
                TextWidget(self,'data_odin', label="Data ODIN", converter=DateConverter()),
                TextWidget(self,'inicio_exame', label="Data de início do exame", converter=DateConverter()),
                TextWidget(self,'data_recebimento', label="Data de recebimento", converter=DateConverter())
            ],
            [
                TextWidget(self,'numero_quesito', label="Número do quesito"),
                TextWidget(self,'autoridade', label="Autoridade", placeholder="Nome do delegado ou juiz"),
            ],
            [
                TextWidget(self,'relatores', label="Relatores", placeholder="Relatores separados por vírgula", converter=convert_relatores),
                TextWidget(self,'revisor', label="Revisor")
            ],
            [
                TextWidget(self,'lacre_entrada', label="Lacre de entrada"),
                TextWidget(self,'lacre_saida', label="Lacre de saída")
            ],
            [
                ObjectsPicsWidget(self, 'fotos', label="Fotos", new_object_name="Celular", multiple=True)
            ],
            [
                TypeAheadWidget(self, 'test_typeahead', label="Test Typeahead", options='tipos_objetos')
            ]
        ]
