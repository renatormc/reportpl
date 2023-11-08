import copy
from reportpl.pics_analyzer import get_objects_from_pics
from pathlib import Path

def pre(context):
    context['peritos'] = copy.deepcopy(context['relatores'])
    if context['revisor']:
        context['peritos'].append(context['revisor'])

    path = Path("./fotos")
    if path.is_dir():
        res = get_objects_from_pics(path)
        print(res)
    # context['n_objetos'] = len(context['objects']) - 1
    # try:
    #     context['pics'] = context['objects'][0]['pics']
    # except IndexError:
    #     context['pics'] = []
    # context['objects'] = context['objects'][1:]