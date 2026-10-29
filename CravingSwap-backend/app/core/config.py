from functools import lru_cache
from pydantic import field_validator
from pydantic_settings import BaseSettings,SettingsConfigDict
class Settings(BaseSettings):
 model_config=SettingsConfigDict(env_file='.env',extra='ignore')
 app_env:str='development'; database_url:str='postgresql+psycopg://user:password@localhost/cravingswap'
 groq_api_key:str=''; groq_model:str='openai/gpt-oss-20b'; serpapi_api_key:str=''
 serpapi_search_url:str='https://serpapi.com/search?engine=google_maps'; open_meteo_url:str='https://api.open-meteo.com/v1/forecast'
 secret_key:str='development-only-change-me-32-characters'; cors_origins:list[str]=['http://localhost:3000']
 @field_validator('secret_key')
 @classmethod
 def valid_key(cls,v):
  if len(v)<32: raise ValueError('SECRET_KEY must be at least 32 characters')
  return v
@lru_cache
def get_settings(): return Settings()
settings=get_settings()
