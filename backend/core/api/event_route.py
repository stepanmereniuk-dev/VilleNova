from django.shortcuts import get_object_or_404
from ninja import Router
from ninja.errors import HttpError

from ..models import Event, User
from .schemas import EventIn, EventOut, EventUpdate

router = Router()


@router.post("/", response=EventOut)
def create_event(request, payload: EventIn):
    if not User.objects.filter(id=payload.user_id).exists():
        raise HttpError(404, "Utilisateur introuvable. Veuillez vous reconnecter.")
    return Event.objects.create(**payload.dict())


@router.get("/", response=list[EventOut])
def list_events(request):
    return Event.objects.all()


@router.get("/{event_id}", response=EventOut)
def get_event(request, event_id: int):
    return get_object_or_404(Event, id=event_id)


@router.put("/{event_id}", response=EventOut)
def update_event(request, event_id: int, payload: EventUpdate):
    event = get_object_or_404(Event, id=event_id)
    for attr, value in payload.dict(exclude_unset=True).items():
        setattr(event, attr, value)
    event.save()
    return event


@router.delete("/{event_id}")
def delete_event(request, event_id: int):
    event = get_object_or_404(Event, id=event_id)
    event.delete()
    return {"success": True}
