from docxtpl.subdoc import Subdoc
from .paragraph import parse_paragraph
from .heading import parse_heading

parsers = {
    'p': parse_paragraph,
    'h1': parse_heading,
    'h2': parse_heading,
    'h3': parse_heading,
    'h4': parse_heading,
    'h5': parse_heading
}

def parse_element(doc: Subdoc, el):
    try:
        parsers[el.name](doc, el)
    except KeyError:
        raise Exception(f"Element of type \"{el.name}\" not implemented")
    