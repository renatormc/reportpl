from report_writer.widgets.widget import Widget


class BaseWebForm:

    def __init__(self) -> None:
        self._widgets_map: dict[str, Widget]|None = None
        self.widgets: list[list[Widget]] = []

    def define_widgets(self) -> None:
        self.widgets = []

    @property
    def widgets_map(self) -> dict[str, Widget]:
        if self._widgets_map is None:
            self._widgets_map = {}
            for row in self.widgets:
                for w in row:
                    self._widgets_map[w.name] = w
        return self._widgets_map

    def get_widget(self, field_name: str) -> Widget:
        return self.widgets_map[field_name]