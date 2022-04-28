from typing import Any

from .base_widget import BaseWidget


class TextWidget(BaseWidget):

    def __init__(self, name: str, label: str|None = None, col: int = 0, default="") -> None:
        super().__init__(name, label=label, col=col)
        self._default = default

    # def __init__(self, name:str, default="") -> None:
    #     self._data = default
    #     self._name = name

    def get_context(self) -> Any:
        ...

    def serialize(self) -> Any:
        ...

    def load(self, value: Any) -> None:
        # self._data
        pass

    def get_default_serialized_data(self) -> Any:
        ...


    @property
    def widget_type(self) -> str:
        return "text_widget"

    @property
    def name(self) -> str:
        return self._name

    @property
    def label(self) -> str:
        ...

    @property
    def col(self) -> int:
        ...