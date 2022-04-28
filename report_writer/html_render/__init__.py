from pathlib import Path
from jinja2 import Template
from bs4 import BeautifulSoup
from rlibs.report_writer.doc_handler.jenv import make_jinja_env

def remove_extra_spaces(text):
    lines = text.split()
    lines = [line.strip() for line in lines]
    return " ".join(lines)

def render_pre_html(model, context: dict) -> None:
    pre_file = Path(model.__file__).parent / "pre.html"
    if pre_file.exists():
       text = pre_file.read_text(encoding="utf-8")
       jinja_env = make_jinja_env(model)
       tm = jinja_env.from_string(text)
       html = tm.render(**context)
       soup = BeautifulSoup(html, 'html.parser')
       for div in soup.find_all('div'):
           var_name = div.attrs['var']
           text = remove_extra_spaces(div.text)
           context[var_name] = text
    
