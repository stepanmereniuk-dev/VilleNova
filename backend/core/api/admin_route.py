from django.shortcuts import get_object_or_404
from ninja import Router

from ..models import Admin
from .schemas import AdminIn, AdminOut

router = Router()


@router.post("/", response=AdminOut)
def create_admin(request, payload: AdminIn):
    return Admin.objects.create(**payload.dict())


@router.get("/", response=list[AdminOut])
def list_admins(request):
    return Admin.objects.all()


@router.get("/{admin_id}", response=AdminOut)
def get_admin(request, admin_id: int):
    return get_object_or_404(Admin, id=admin_id)


@router.put("/{admin_id}", response=AdminOut)
def update_admin(request, admin_id: int, payload: AdminIn):
    admin = get_object_or_404(Admin, id=admin_id)
    admin.user_id = payload.user_id
    admin.save()
    return admin


@router.delete("/{admin_id}")
def delete_admin(request, admin_id: int):
    admin = get_object_or_404(Admin, id=admin_id)
    admin.delete()
    return {"success": True}
