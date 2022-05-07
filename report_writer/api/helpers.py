from report_writer.api.database import db
from report_writer.api.database import repo
from report_writer import ReportWriter
from report_writer.api import config

def reacreate_db():
    print("Recreating DB")
    try:
        config.DBFILE.unlink()
    except FileNotFoundError:
        pass
    db.init_db()

    rw = ReportWriter("./models")
    docmodels = rw.list_models()
    for d in docmodels:
        rw.set_model(d)
        lists = rw.get_lists()
        for l in lists:
            repo.save_list(d, l["name"], l["items"])