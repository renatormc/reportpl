from typing import Type
from .widget import Widget
from .text_widget import TextWidget
from .array_widget import ArrayWidget

__widgets__: list[Type['Widget']] = [
    TextWidget,
    ArrayWidget
]
