from report_writer.widgets import TextWidget, Widget

widgets: list[list[Widget]] = [
    [
        TextWidget('nome', default="João silva"),
        TextWidget('endereco', default=""),
    ]
]