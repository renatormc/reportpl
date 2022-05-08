from report_writer.widgets.widget import Widget
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from report_writer import ReportWriter
   


class BaseWebForm:

    def __init__(self) -> None:
        self._widgets_map: dict[str, Widget]|None = None
        self.widgets: list[list[Widget]] = []
        self._report_writer: 'ReportWriter'|None = None

    @property
    def report_writer(self) -> 'ReportWriter':
        if self._report_writer is None:
            raise Exception("ReportWriter instance was not injected on form")
        return self._report_writer
    
    def set_report_writer(self, rw: 'ReportWriter') -> None:
        self._report_writer = rw


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