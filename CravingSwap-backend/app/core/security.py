from datetime import datetime,timedelta,timezone
from hashlib import sha256
import jwt
from passlib.context import CryptContext
from app.core.config import settings
pwd=CryptContext(schemes=['bcrypt'],deprecated='auto')
def password_hash(v): return pwd.hash(v)
def verify(v,h): return pwd.verify(v,h)
def make(uid,kind,minutes):
 now=datetime.now(timezone.utc); return jwt.encode({'sub':str(uid),'type':kind,'iat':now,'exp':now+timedelta(minutes=minutes)},settings.secret_key,algorithm='HS256')
def decode(v,kind):
 p=jwt.decode(v,settings.secret_key,algorithms=['HS256'])
 if p.get('type')!=kind: raise jwt.InvalidTokenError()
 return p
def digest(v): return sha256(v.encode()).hexdigest()
