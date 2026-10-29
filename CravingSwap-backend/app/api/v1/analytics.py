from fastapi import APIRouter,Depends
from sqlalchemy import select,func,case
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import current_user
from app.models import CravingSession,CravingOutcome
r=APIRouter(prefix='/analytics',tags=['Analytics'])
@r.get('/overview')
def overview(u=Depends(current_user),db:Session=Depends(get_db)):
 total=db.scalar(select(func.count()).select_from(CravingSession).where(CravingSession.user_id==u.id)) or 0;q=select(func.count(CravingOutcome.id),func.coalesce(func.sum(CravingOutcome.money_saved),0),func.sum(case((CravingOutcome.outcome_type=='JUNK_FOOD',1),else_=0))).join(CravingSession).where(CravingSession.user_id==u.id);done,saved,relapses=db.execute(q).one();return {'totalCravings':total,'cravingsResolved':done or 0,'relapseCount':relapses or 0,'estimatedMoneySaved':str(saved),'disclaimer':'Patterns are observational, not medical conclusions.'}
@r.get('/craving-patterns')
def patterns(u=Depends(current_user),db:Session=Depends(get_db)):
 rows=db.execute(select(CravingSession.category,func.count()).where(CravingSession.user_id==u.id).group_by(CravingSession.category).order_by(func.count().desc()).limit(10)).all();return {'commonCategories':[{'category':a,'count':b} for a,b in rows]}
