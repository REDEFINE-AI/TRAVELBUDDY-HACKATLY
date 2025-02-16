from pydantic import BaseModel, EmailStr


class UserAuth(BaseModel):
    email: EmailStr
    password: str
    username: str
    location: str


class UserOut(BaseModel):
    email: EmailStr
    id: str


class TokenSchema(BaseModel):
    access_token: str
    refresh_token: str
