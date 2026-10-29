from datetime import datetime,timedelta,timezone
from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models import User,UserProfile,RefreshToken
from app.schemas.domain import Register,Tokens,Refresh
from app.core.security import password_hash,verify,make,decode,digest
from app.api.deps import current_user
r=APIRouter(prefix='/auth',tags=['Authentication'])
def issue(db,u):
 a=make(u.id,'access',30);ref=make(u.id,'refresh',10080);db.add(RefreshToken(user_id=u.id,token_hash=digest(ref),expires_at=datetime.now(timezone.utc)+timedelta(days=7)));db.commit();return Tokens(access_token=a,refresh_token=ref)
@r.post('/register',response_model=Tokens,status_code=201)
def register(x:Register,db:Session=Depends(get_db)):
 if db.scalar(select(User).where(User.email==x.email.lower())):raise HTTPException(409,'Email exists')
 u=User(email=x.email.lower(),password_hash=password_hash(x.password));db.add(u);db.flush();db.add(UserProfile(user_id=u.id));db.commit();return issue(db,u)
@r.post('/login',response_model=Tokens)
def login(x:Register,db:Session=Depends(get_db)):
 u=db.scalar(select(User).where(User.email==x.email.lower()))
 if not u or not verify(x.password,u.password_hash):raise HTTPException(401,'Invalid credentials')
 return issue(db,u)
@r.post('/refresh',response_model=Tokens)
def refresh(x:Refresh,db:Session=Depends(get_db)):
 try:p=decode(x.refresh_token,'refresh')
 except Exception:raise HTTPException(401,'Invalid refresh token')
 row=db.scalar(select(RefreshToken).where(RefreshToken.token_hash==digest(x.refresh_token),RefreshToken.revoked==False))
 if not row:raise HTTPException(401,'Revoked refresh token')
 row.revoked=True;db.commit();return issue(db,db.get(User,p['sub']))
@r.post('/logout',status_code=204)
def logout(x:Refresh,db:Session=Depends(get_db)):
 row=db.scalar(select(RefreshToken).where(RefreshToken.token_hash==digest(x.refresh_token)))
 if row:row.revoked=True;db.commit()
@r.get('/me')
def me(u=Depends(current_user)):return {'id':str(u.id),'email':u.email}
