import logging
from datetime import datetime
import pytz
from pathlib import Path

# IST timezone
IST = pytz.timezone('Asia/Kolkata')

class ISTFormatter(logging.Formatter):
    def formatTime(self, record, datefmt=None):
        dt = datetime.fromtimestamp(record.created, tz=IST)
        return dt.strftime(datefmt or '%Y-%m-%d %H:%M:%S %Z')

class DailyFileHandler(logging.FileHandler):
    def __init__(self, logs_dir):
        self.logs_dir = Path(logs_dir)
        self.logs_dir.mkdir(exist_ok=True)
        self.current_date = None
        super().__init__(self._get_filename(), encoding='utf-8')
    
    def _get_filename(self):
        current_date = datetime.now(IST).strftime("%Y-%m-%d")
        if current_date != self.current_date:
            self.current_date = current_date
        return str(self.logs_dir / f"{current_date}.log")
    
    def emit(self, record):
        new_filename = self._get_filename()
        if new_filename != self.baseFilename:
            self.close()
            self.baseFilename = new_filename
            self.stream = self._open()
        super().emit(record)

def setup_logger():
    logs_dir = Path(__file__).parent.parent.parent.parent / "logs"
    logger = logging.getLogger("traviax_api")
    logger.setLevel(logging.INFO)
    logger.handlers.clear()
    
    formatter = ISTFormatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    
    file_handler = DailyFileHandler(logs_dir)
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)
    
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    return logger

api_logger = setup_logger()

def log_api_call(method: str, endpoint: str, status_code: int, duration: float = None):
    duration_str = f" - Duration: {duration:.3f}s" if duration else ""
    message = f"API Call - {method} {endpoint} - Status: {status_code}{duration_str}"
    (api_logger.error if status_code >= 400 else api_logger.info)(message)

def log_error(message: str, error: Exception = None):
    api_logger.error(f"{message} - Error: {error}" if error else message)

def log_info(message: str):
    api_logger.info(message)

def log_warning(message: str):
    api_logger.warning(message)