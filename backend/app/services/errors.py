class LLMServiceError(Exception):
    """
    Raised when an LLM call fails (timeout, bad response, parse error).
    """
    def __init__(self, message: str, error_code: str = "LLM_ERROR"):
        super().__init__(message)
        self.error_code = error_code

class DatabaseError(Exception):
    """
    Raised on MongoDB timeouts and write failures.
    """
    def __init__(self, message: str, error_code: str = "DB_ERROR"):
        super().__init__(message)
        self.error_code = error_code
