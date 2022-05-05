from report_writer.widgets.widget import Widget


class BaseWebForm:
    def __init__(self) -> None:
        self.widgets_map: dict[str, Widget] = {}
        self.widgets: list[list[Widget]] = []

    def define_widgets(self) -> None:
        self.widgets = []

    def map_widgets(self):
        for row in self.widgets:
            for w in row:
                self.widgets_map[w.name] = w