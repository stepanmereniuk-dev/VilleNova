from django.contrib.auth.hashers import check_password, make_password
from django.shortcuts import get_object_or_404
from ninja import Router

from ..models import User
from .schemas import LoginIn, LoginOut, UserIn, UserOut, UserUpdate

router = Router()


@router.post("/login", response=LoginOut)
def login(request, payload: LoginIn):
    user = User.objects.filter(email=payload.email).first()
    if user is None or not check_password(payload.password, user.password_hash):
        return {"success": False, "user": None}
    return {"success": True, "user": user}


@router.post("/", response=UserOut)
def create_user(request, payload: UserIn):
    data = payload.dict()
    data["password_hash"] = make_password(data.pop("password"))
    return User.objects.create(**data)


@router.get("/", response=list[UserOut])
def list_users(request):
    return User.objects.all()


@router.get("/{user_id}", response=UserOut)
def get_user(request, user_id: int):
    return get_object_or_404(User, id=user_id)


@router.put("/{user_id}", response=UserOut)
def update_user(request, user_id: int, payload: UserUpdate):
    user = get_object_or_404(User, id=user_id)
    data = payload.dict(exclude_unset=True)
    if "password" in data:
        data["password_hash"] = make_password(data.pop("password"))
    for attr, value in data.items():
        setattr(user, attr, value)
    user.save()
    return user


@router.delete("/{user_id}")
def delete_user(request, user_id: int):
    user = get_object_or_404(User, id=user_id)
    user.delete()
    return {"success": True}
