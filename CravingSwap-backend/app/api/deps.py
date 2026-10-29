from uuid import UUID
import jwt
from fastapi import Depends,HTTPException
from fastapi.security import HTTPBearer,HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import decode
from app.models import User
bearer=HTTPBearer()
def current_user(c:HTTPAuthorizationCredentials=Depends(bearer),db:Session=Depends(get_db)):
 try:uid=UUID(decode(c.credentials,'access')['sub'])
 except (jwt.PyJWTError,ValueError):raise HTTPException(401,'Invalid access token')
 u=db.get(User,uid)
 if not u or not u.is_active:raise HTTPException(401,'Inactive user')
 return u
