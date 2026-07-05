import logging

from .models import AuditLog

logger = logging.getLogger(__name__)


class AuditLogMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if request.path.startswith("/api/"):
            try:
                AuditLog.objects.create(
                    user=(
                        request.user
                        if getattr(request, "user", None) and request.user.is_authenticated
                        else None
                    ),
                    method=request.method,
                    path=request.path[:512],
                    status_code=response.status_code,
                    ip_address=request.META.get("REMOTE_ADDR"),
                )
            except Exception:  # Do not fail completed API requests if audit logging is unavailable.
                logger.exception("Failed to write API audit log for %s", request.path)
        return response
