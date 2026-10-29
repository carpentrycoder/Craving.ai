from uuid import UUID
from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import current_user
from app.models import CravingSession,CravingOutcome
from app.schemas.domain import OutcomeRequest
from app.services.cost_service import calculate_savings
r=APIRouter(prefix='/outcomes',tags=['Outcomes'])
@r.post('/sessions/{sid}',status_code=201)
def record(sid:UUID,x:OutcomeRequest,u=Depends(current_user),db:Session=Depends(get_db)):
 s=db.scalar(select(CravingSession).where(CravingSession.id==sid,CravingSession.user_id==u.id))
 if not s:raise HTTPException(404,'Not found')
 if s.outcome:raise HTTPException(409,'Outcome already exists')
 relapse=x.outcome_type=='JUNK_FOOD';o=CravingOutcome(craving_session_id=s.id,outcome_type=x.outcome_type,selected_suggestion_id=x.selected_suggestion_id,actual_food=x.actual_food,actual_cost=x.actual_cost,estimated_original_cost=x.estimated_original_cost,money_saved=calculate_savings(x.estimated_original_cost,x.actual_cost,relapse),notes=x.notes);s.status='RELAPSED' if relapse else 'RESOLVED';db.add(o);db.commit();return {'outcomeId':str(o.id),'moneySaved':str(o.money_saved),'supportiveMessage':'No guilt. Focus on the next practical choice.' if relapse else 'Nice work choosing a practical alternative.'}
