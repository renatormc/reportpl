from pathlib import Path
from fastdoc.helpers import write_workdir_data


def init_dir(workdir: Path) -> None:
    data = {'pericia': ''}
    write_workdir_data(workdir, data)