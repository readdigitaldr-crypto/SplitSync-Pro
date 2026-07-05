from rest_framework.routers import DefaultRouter
from .views import UserSearchViewSet, FriendRequestViewSet, FriendshipViewSet

router = DefaultRouter()
router.register("users", UserSearchViewSet, basename="user-search")
router.register("requests", FriendRequestViewSet, basename="friend-request")
router.register("", FriendshipViewSet, basename="friend")
urlpatterns = router.urls
