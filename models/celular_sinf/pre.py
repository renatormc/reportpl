import copy
from report_writer.pics_analyzer import get_objects_from_pics
import re

def pre(context):
    context['peritos'] = copy.deepcopy(context['relatores'])
    if context['revisor']:
        context['peritos'].append(context['revisor'])
    context['n_objetos'] = len(context['objects']) - 1