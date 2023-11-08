from reportpl.api.database import db
from reportpl.api.database import repo
from reportpl import Reportpl
from reportpl.api import config
from reportpl import config as rplcfg

def reacreate_db():
    print(rplcfg.MODELS_FOLDER)
    print("Recreating DB")
    try:
        config.DBFILE.unlink()
    except FileNotFoundError:
        pass
    db.init_db()

    rw = Reportpl(rplcfg.MODELS_FOLDER)
    docmodels = rw.list_models()
    for d in docmodels:
        rw.set_model(d)
        lists = rw.get_lists()
        for l in lists:
            repo.save_list(d, l["name"], l["items"])