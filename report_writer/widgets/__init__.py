from typing import Type
from .widget import Widget
from .text_widget import TextWidget

__widgets__: list[Type['Widget']] = [
    TextWidget
]
