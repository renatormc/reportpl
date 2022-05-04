import copy
from report_writer.pics_analyzer import get_objects_from_pics

def pre(context):
    context['objects'] = get_objects_from_pics(context['pics_folder'], default_object_type="Celular")
    context['peritos'] = copy.deepcopy(context['relatores'])
    if context['revisor']:
        context['peritos'].append(context['revisor'])
    context['n_objetos'] = len(context['objects'].objects) 