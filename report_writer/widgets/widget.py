from typing import Any, Protocol


class Widget(Protocol):

    def get_context(self) -> Any:
        pass

    def serialize(self) -> Any:
        pass

    def load(self, value: Any) -> None:
        pass

    def get_default_serialized_data(self) -> Any:
        pass

    @property
    def widget_type(self) -> str:
        pass

    @property
    def name(self) -> str:
        pass

    @property
    def label(self) -> str:
        pass


    @property
    def col(self) -> int:
        pass
