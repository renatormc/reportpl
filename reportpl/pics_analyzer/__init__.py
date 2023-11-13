from pathlib import Path
import re
from typing import TypedDict, Optional, Union
from reportpl.types import CaseObjectsType, ObjectType
from typing import TypedDict

class AnalyzedPicInfo(TypedDict):
    obj_name: str
    alias: str
    obj_number: str
    pic_seq: str


class NameAnalyzer:
    def __init__(self):
        self.reg = re.compile(r'((^[A-Za-z]+)(\d+))(?:[\d\.\-]+)?(?:_(\d+))?$')

    def analise_name(self, name) -> Optional[AnalyzedPicInfo]:
        res = self.reg.search(name)
        if not res:
            return None
        ret: AnalyzedPicInfo = {
            'obj_name': res.group(1),
            'alias': res.group(2),
            'obj_number': res.group(3),
            'pic_seq': res.group(4)
        }
        if ret['obj_number'] is not None:
            return ret


# def get_objects_from_pics(folder: Union[Path, str], default_object_type: Optional[str]=None) -> CaseObjectsType:
#     folder = Path(folder)
#     objects = CaseObjectsType(folder)
#     analyzer = NameAnalyzer()
#     obj_map: dict[str, ObjectType] = {}
#     for entry in folder.iterdir():
#         if entry.name.startswith("_"):
#             continue
#         res = analyzer.analise_name(entry.stem)
#         if not res:
#             continue
#         if objects.alias and res['alias'] != objects.alias:
#             objects = CaseObjectsType(folder)
#             objects.pics_not_classified = [entry.name for entry in folder.iterdir()]
#             return objects
#         objects.alias = res['alias']
#         try:
#             obj_map[res['obj_number']].pics.append(str(entry.absolute()))
#         except KeyError:
#             name = res['obj_number']
#             obj = ObjectType(name=name, pics=[str(entry.absolute())])
            
#             obj.type = default_object_type or ""
#             obj_map[res['obj_number']] = obj
#     objects.objects = [obj for obj in obj_map.values()]
#     return objects

class Resp(TypedDict):
    name: str
    report_name: str
    number: int
    pics: list[str]
    pics_files: list[str]

def get_objects_from_pics(folder: Union[Path, str]):
    objects = {}
    if not folder.exists():
        return objects
    analyzer = NameAnalyzer()
    for entry in folder.iterdir():
        if entry.name.startswith("_"):
            continue
        res = analyzer.analise_name(entry.stem)
        if not res:
            continue
        obj = res['obj_name']
        try:
            objects[obj]['pics'].append(str(entry))
        except KeyError:
            objects[obj] = {'number': int(res['obj_number']), 'pics': [str(entry)], 'pics_files': []}
        objects[obj]['pics_files'].append(entry.name)
    items = []
    for key, value in objects.items():
        objects[key]['pics'].sort()
        items.append(
            {'name': key, 'report_name': f"Vestígio {value['number']}", 'number': value['number'], 'pics': value['pics'], 'pics_files': value['pics_files']})
    items.sort(key=lambda x: x['number'])
    return items
