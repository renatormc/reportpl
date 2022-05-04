from report_writer.widgets import TextWidget, Widget
from report_writer.types import ValidationError
from report_writer.web_converters import DateConverter, PathConverter

def convert_pericia(value):
    parts = value.split("/")
    return {"seq": int(parts[0]), "rg": int(parts[1]), "ano": int(parts[2])}


def convert_relatores(value):
    return [item.strip() for item in value.split(",")]


widgets: list[list[Widget]] = [
    [
        TextWidget('pericia', label="Perícia", required=True, converter=convert_pericia),
        TextWidget('requisitante', label="Requisitante", required=True),
        TextWidget('procedimento', label="Procedimento"),
        TextWidget('ocorrencia_odin', label="Ocorrência ODIN")
    ],
    [
       TextWidget('data_odin', label="Data ODIN", converter=DateConverter()),
       TextWidget('inicio_exame', label="Data de início do exame", converter=DateConverter()),
       TextWidget('data_recebimento', label="Data de recebimento", converter=DateConverter())
    ],
    [
        TextWidget('numero_quesito', label="Número do quesito"),
        TextWidget('autoridade', label="Autoridade", placeholder="Nome do delegado ou juiz"),
    ],
    [
        TextWidget('relatores', label="Relatores", placeholder="Relatores separados por vírgula", converter=convert_relatores),
        TextWidget('revisor', label="Revisor")
    ],
    [
        TextWidget('lacre_entrada', label="Lacre de entrada"),
        TextWidget('lacre_saida', label="Lacre de saída")
    ],
    [
        TextWidget('pics_folder', label="Pasta com fotos", converter=PathConverter(type_="dir"))
    ]
]
