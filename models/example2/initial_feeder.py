from pathlib import Path
from typing import Optional, Union
from report_writer.types import InitialData


def get_initial_data(workdir: Union[Path, str]) -> Optional[InitialData]:
    return None