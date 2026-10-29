import httpx
from app.core.config import settings
async def current(lat,lon):
 try:
  async with httpx.AsyncClient(timeout=5) as c:r=await c.get(settings.open_meteo_url,params={'latitude':lat,'longitude':lon,'current':'temperature_2m,precipitation,weather_code'});r.raise_for_status();return r.json().get('current',{})
 except httpx.HTTPError:return {}
