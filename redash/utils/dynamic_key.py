"""
Utils for dynamic key.
"""

from typing import Dict

from itsdangerous import URLSafeTimedSerializer

from redash import settings
from redash.worker import get_job_logger

logger = get_job_logger(__name__)


def generate_token(dashboard_id: int, user_id: int) -> str:
    """Generate a token based on the dashboard and user id."""
    serializer = URLSafeTimedSerializer(settings.SECRET_KEY)
    token = {'id': dashboard_id, 'user': user_id}
    dynamic_key = serializer.dumps(token, salt=settings.DATASOURCE_SECRET_KEY)
    return dynamic_key


def decode_token(dynamic_key: str) -> Dict[str, int]:
    """Decode the dynamically generated token."""
    decode_json = {}
    try:
        serializer = URLSafeTimedSerializer(settings.SECRET_KEY)
        decode_json = serializer.loads(dynamic_key, salt=settings.DATASOURCE_SECRET_KEY,
                                       max_age=int(settings.DASHBOARD_KEY_EXPIRY_PERIOD))
    except Exception as e:  # noqa: E722
        logger.error('Error occurred on decoding the token or token expired')
        logger.error(e)

    return decode_json
