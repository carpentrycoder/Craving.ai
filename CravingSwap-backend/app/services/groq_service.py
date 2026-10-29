import json
from groq import Groq
from app.core.config import settings
from app.prompts.craving_v1 import SYSTEM_PROMPT
from app.schemas.domain import AIResult
def generate(payload):
 if not settings.groq_api_key: raise RuntimeError('GROQ_API_KEY missing')
 client=Groq(api_key=settings.groq_api_key); last=None
 for _ in range(2):
  try:
   r=client.chat.completions.create(model=settings.groq_model,temperature=.2,response_format={'type':'json_object'},messages=[{'role':'system','content':SYSTEM_PROMPT+' Schema: '+json.dumps(AIResult.model_json_schema())},{'role':'user','content':json.dumps(payload,default=str)}])
   return AIResult.model_validate_json(r.choices[0].message.content)
  except Exception as e: last=e
 raise RuntimeError('AI response invalid') from last
