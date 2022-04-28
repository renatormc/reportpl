from typing import Any
import stringcase


class TextWidget:

    def __init__(self, name: str, label: str|None = None, col: int = 0, default="") -> None:
        self._name = name
        self._col = col
        self._default = default
        self._data = default
        self._label = label or stringcase.capitalcase(name)

    def get_context(self) -> Any:
        return self._data

    def serialize(self) -> Any:
        return self._data

    def load(self, value: Any) -> None:
        self._data = value
        

    def get_default_serialized_data(self) -> Any:
        return self._default


    @property
    def widget_type(self) -> str:
        return "text_widget"

    @property
    def name(self) -> str:
        return self._name

    @property
    def label(self) -> str:
        return self._label

    @property
    def col(self) -> int:
        return self._col