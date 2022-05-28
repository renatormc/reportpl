from report_writer.widgets import TextWidget, ArrayWidget, TextAreaWidget, TypeAheadObjWidget, SelectWidget, CheckBoxWidget
from report_writer.types import ValidationError
from report_writer.web_converters import DateConverter, FloatConverter
from report_writer.base_web_form import BaseWebForm



class Form(BaseWebForm):
    
    def define_widgets(self):
        self.widgets = [
            [
                TextWidget(self, 'nome', default="", placeholder="Digite seu nome",required=True),
                TextWidget(self, 'data_nascimento', label="Data de nascimento",converter=DateConverter()),
            ],
        ]