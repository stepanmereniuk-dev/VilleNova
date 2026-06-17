from datetime import datetime
from typing import Any, Optional

from ninja import Schema


# ---------- User ----------
class UserIn(Schema):
    first_name: str
    last_name: str
    email: str
    password: str


class UserUpdate(Schema):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None


class UserOut(Schema):
    id: int
    first_name: str
    last_name: str
    email: str
    created_at: datetime
    updated_at: datetime


class LoginIn(Schema):
    email: str
    password: str


class LoginOut(Schema):
    success: bool
    user: Optional[UserOut] = None


# ---------- Event ----------
class EventIn(Schema):
    user_id: int
    title: str
    image_url: Optional[str] = None
    date_range: Optional[str] = None
    description: Optional[str] = None
    long_description: Optional[str] = None
    conditions: Optional[str] = None
    tags: Optional[Any] = None
    location_name: Optional[str] = None
    location_address: Optional[str] = None
    location_postal_code: Optional[str] = None
    location_city: Optional[str] = None
    registration_url: Optional[str] = None


class EventUpdate(Schema):
    user_id: Optional[int] = None
    title: Optional[str] = None
    image_url: Optional[str] = None
    date_range: Optional[str] = None
    description: Optional[str] = None
    long_description: Optional[str] = None
    conditions: Optional[str] = None
    tags: Optional[Any] = None
    location_name: Optional[str] = None
    location_address: Optional[str] = None
    location_postal_code: Optional[str] = None
    location_city: Optional[str] = None
    registration_url: Optional[str] = None


class EventOut(Schema):
    id: int
    user_id: int
    title: str
    image_url: Optional[str] = None
    date_range: Optional[str] = None
    description: Optional[str] = None
    long_description: Optional[str] = None
    conditions: Optional[str] = None
    tags: Optional[Any] = None
    location_name: Optional[str] = None
    location_address: Optional[str] = None
    location_postal_code: Optional[str] = None
    location_city: Optional[str] = None
    registration_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime


# ---------- Admin ----------
class AdminIn(Schema):
    user_id: int


class AdminOut(Schema):
    id: int
    user_id: int
    created_at: datetime
