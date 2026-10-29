from decimal import Decimal
from uuid import UUID
from fastapi import APIRouter,Depends,HTTPException,Query
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import current_user
from app.models import CravingSession,CravingSuggestion
from app.schemas.domain import CravingRequest,AIResult,Suggestion
from app.services.craving_analyzer import fallback
from app.services.groq_service import generate
from app.services.maps_service import search
from app.services.weather_service import current
r=APIRouter(prefix='/cravings',tags=['Cravings'])
@r.post('/analyze',status_code=201)
async def analyze(x:CravingRequest,u=Depends(current_user),db:Session=Depends(get_db)):
 base=fallback(x.craving);weather=await current(x.latitude,x.longitude) if x.latitude is not None else {}
 try:ai=generate({'craving':x.craving,'weather':weather,'fallback':base.model_dump(mode='json')})
 except RuntimeError:
  q=Suggestion(level=1,title='Practical quick-buy swap',description='Choose a grilled whole-wheat option with vegetables.',estimated_cost=80,estimated_time_minutes=10,craving_match_reason='Similar savory flavor');f=Suggestion(level=2,title='Five-minute toast fix',description='Whole-wheat toast with paneer or curd, vegetables and spices.',estimated_cost=60,estimated_time_minutes=5,ingredients=['whole-wheat bread','paneer or curd','vegetables'],instructions=['Assemble','Toast'],craving_match_reason='Warm, savory and textured');rec=Suggestion(level=3,title='Quick homemade alternative',description='A simple homemade version with whole grains, protein and vegetables.',estimated_cost=90,estimated_time_minutes=20,ingredients=['whole-grain base','protein','vegetables'],instructions=['Prepare','Cook','Serve'],craving_match_reason='Keeps the core craving profile');ai=AIResult(craving_analysis=base,quick_buy_swap=[q],five_minute_fix=[f],recipe=rec,behavioral_note='Choose the most manageable option right now.')
 s=CravingSession(user_id=u.id,craving_text=x.craving,normalized_food=ai.craving_analysis.normalized_food,category=ai.craving_analysis.category,cuisine=ai.craving_analysis.cuisine,flavor_profile=ai.craving_analysis.flavors,texture_profile=ai.craving_analysis.textures,estimated_junk_cost=ai.craving_analysis.price_max,craving_intensity=x.craving_intensity,weather_context=weather,ai_analysis=ai.craving_analysis.model_dump(mode='json'));db.add(s);db.flush();items=ai.quick_buy_swap+ai.five_minute_fix+[ai.recipe]
 for z in items:db.add(CravingSuggestion(craving_session_id=s.id,**z.model_dump()))
 db.commit();nearby=[]
 if x.include_nearby and x.latitude is not None:
  try:nearby=await search(ai.craving_analysis.suggested_search_query,x.latitude,x.longitude)
  except Exception:nearby=[]
 return {'sessionId':str(s.id),'craving':{'text':x.craving,**ai.craving_analysis.model_dump(mode='json')},'alternatives':{'quickBuy':[z.model_dump(mode='json') for z in ai.quick_buy_swap],'fiveMinute':[z.model_dump(mode='json') for z in ai.five_minute_fix],'recipe':ai.recipe.model_dump(mode='json')},'nearbyOptions':nearby,'cost':{'estimatedOriginalCost':str(s.estimated_junk_cost),'lowestAlternativeCost':str(min(z.estimated_cost for z in items))},'behavioralNote':ai.behavioral_note,'disclaimer':'General wellness ideas, not medical advice.'}
@r.get('')
def history(page:int=Query(1,ge=1),page_size:int=Query(20,ge=1,le=100),category:str|None=None,u=Depends(current_user),db:Session=Depends(get_db)):
 q=select(CravingSession).where(CravingSession.user_id==u.id)
 if category:q=q.where(CravingSession.category==category)
 return {'items':db.scalars(q.order_by(CravingSession.created_at.desc()).offset((page-1)*page_size).limit(page_size)).all(),'page':page,'pageSize':page_size}
@r.get('/{sid}')
def one(sid:UUID,u=Depends(current_user),db:Session=Depends(get_db)):
 s=db.scalar(select(CravingSession).where(CravingSession.id==sid,CravingSession.user_id==u.id))
 if not s:raise HTTPException(404,'Not found')
 return s
@r.delete('/{sid}',status_code=204)
def delete(sid:UUID,u=Depends(current_user),db:Session=Depends(get_db)):
 s=db.scalar(select(CravingSession).where(CravingSession.id==sid,CravingSession.user_id==u.id))
 if not s:raise HTTPException(404,'Not found')
 db.delete(s);db.commit()
