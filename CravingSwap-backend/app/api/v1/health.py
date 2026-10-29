from fastapi import APIRouter,Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.db.session import get_db
r=APIRouter(tags=['Health'])
@r.get('/health')
def health():return {'status':'ok'}
@r.get('/health/ready')
def ready(db:Session=Depends(get_db)):db.execute(text('SELECT 1'));return {'status':'ready','database':'connected'}
