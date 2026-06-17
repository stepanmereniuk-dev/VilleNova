from ninja import NinjaAPI
from .user_route import router as user_router
from .event_route import router as event_router

api = NinjaAPI()
api.add_router("/users", user_router)
api.add_router("/events", event_router)
