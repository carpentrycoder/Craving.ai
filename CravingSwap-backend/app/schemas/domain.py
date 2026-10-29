from decimal import Decimal
from uuid import UUID
from pydantic import EmailStr,Field,model_validator
from app.schemas.common import APIModel
class Register(APIModel): email:EmailStr; password:str=Field(min_length=8,max_length=128)
class Tokens(APIModel): access_token:str; refresh_token:str; token_type:str='bearer'
class Refresh(APIModel): refresh_token:str
class CravingRequest(APIModel):
 craving:str=Field(min_length=2,max_length=500); latitude:float|None=Field(None,ge=-90,le=90); longitude:float|None=Field(None,ge=-180,le=180); include_nearby:bool=False; craving_intensity:int|None=Field(None,ge=1,le=10)
 @model_validator(mode='after')
 def pair(self):
  if (self.latitude is None)!=(self.longitude is None): raise ValueError('latitude and longitude must be provided together')
  return self
class Analysis(APIModel): normalized_food:str; category:str; cuisine:str|None=None; flavors:list[str]; textures:list[str]; price_min:Decimal=Field(ge=0); price_max:Decimal=Field(ge=0); suggested_search_query:str; confidence:float=Field(ge=0,le=1)
class Suggestion(APIModel): level:int=Field(ge=1,le=3); title:str; description:str; estimated_cost:Decimal=Field(ge=0); estimated_time_minutes:int=Field(ge=0); ingredients:list[str]=[]; instructions:list[str]=[]; health_benefit:str=''; craving_match_reason:str; source_type:str='AI'
class AIResult(APIModel): craving_analysis:Analysis; quick_buy_swap:list[Suggestion]; five_minute_fix:list[Suggestion]; recipe:Suggestion; behavioral_note:str
class OutcomeRequest(APIModel): outcome_type:str; selected_suggestion_id:UUID|None=None; actual_food:str|None=None; actual_cost:Decimal=Field(0,ge=0); estimated_original_cost:Decimal=Field(ge=0); notes:str|None=None
