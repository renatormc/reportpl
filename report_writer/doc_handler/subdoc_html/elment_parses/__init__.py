from docxtpl.subdoc import Subdoc
from .paragraph import parse_paragraph

parsers = {
    'p': parse_paragraph
}

def parse_element(doc: Subdoc, el):
    try:
        parsers[el.name](doc, el)
    except KeyError:
        raise Exception(f"Elemente of type \"{el.name}\" not implemented")
    