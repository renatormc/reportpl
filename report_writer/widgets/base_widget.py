from typing import Any
import stringcase


class BaseWidget(object):

    def __init__(self, name: str, label: str|None = None, col: int = 0) -> None:
        self._name = name
        self._label = label or stringcase.capitalcase(label)
        self._raw_data: Any = None
        self._col = col
        self._widget_type = stringcase.camelcase(str(self.__class__))

    def get_context(self) -> Any:
        raise NotImplementedError

    def serialize(self) -> Any:
        raise NotImplementedError

    def load(self, value: Any) -> None:
        raise NotImplementedError

    def get_default_serialized_data(self) -> Any:
        raise NotImplementedError

    @property
    def widget_type(self) -> str:
        return self._widget_type 

    @property
    def name(self) -> str:
        return self._name

    @property
    def label(self) -> str:
        return self._label

    @property
    def col(self) -> int:
        return self._col
