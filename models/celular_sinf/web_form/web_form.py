from pathlib import Path
from report_writer.base_web_form import BaseWebForm
from report_writer.widgets import TextWidget, ObjectsPicsWidget, TypeAheadWidget, FileWidget, SelectWidget
from report_writer.types import ExternalBrigdWasNotSet, ValidationError
from report_writer.web_converters import DateConverter, PathConverter, IntConverter

def convert_pericia(form, value):
    parts = value.split("/")
    try:
        return {"seq": int(parts[0]), "rg": int(parts[1]), "ano": int(parts[2])}
    except:
        raise ValidationError("Formato incorreto")


def convert_relatores(form, value):
    return [item.strip() for item in value.split(",")]

class Form(BaseWebForm):

    def file_parse(self, path: Path):
        try:
            brg = self.report_writer.external_bridge
        except ExternalBrigdWasNotSet:
            pass
        return {'pericia': "123/123456/2021"}

    def define_widgets(self):

        self.widgets = [
            [
                FileWidget(self, 'requisicao', label='PDF Requisição ODIN',file_parser=self.file_parse, accept=".pdf"),
            ],
            [
                TextWidget(self, 'pericia', label="Perícia", placeholder="SEQ/RG/ANO", required=True, converter=convert_pericia),
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
                TextWidget(self,'n_quesito', label="Número do quesito"),
                TextWidget(self,'autoridade', label="Autoridade", placeholder="Nome do delegado ou juiz"),
            ],
            [
                TextWidget(self,'relatores', label="Relatores", placeholder="Relatores separados por vírgula", converter=convert_relatores),
                TextWidget(self,'revisor', label="Revisor")
            ],
            [
                TextWidget(self,'lacre_entrada', label="Lacre de entrada"),
                TextWidget(self,'lacre_saida', label="Lacre de saída"),
                SelectWidget(self, 'n_midias', options='opcoes_midias', default="Sem mídias")
            ],
            [
                ObjectsPicsWidget(self, 'objects', label="Fotos",  new_object_name="Celular", multiple=True)
            ]
        ]
