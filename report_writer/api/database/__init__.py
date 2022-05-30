from report_writer.api import config
from .db import DB

db: DB = DB(config.DATABASE_URI)