import math,httpx
from app.core.config import settings
def distance_km(a,b,c,d):
 r=6371;p1,p2=math.radians(a),math.radians(c);x=math.sin(math.radians(c-a)/2)**2+math.cos(p1)*math.cos(p2)*math.sin(math.radians(d-b)/2)**2;return r*2*math.atan2(math.sqrt(x),math.sqrt(1-x))
async def search(query,lat,lon,radius=5):
 if not settings.serpapi_api_key:return []
 params={'engine':'google_maps','q':query[:120],'ll':f'@{lat},{lon},14z','api_key':settings.serpapi_api_key}
 async with httpx.AsyncClient(timeout=8) as c:r=await c.get(settings.serpapi_search_url,params=params);r.raise_for_status();data=r.json()
 out=[]
 for p in data.get('local_results',[]):
  g=p.get('gps_coordinates') or {};a=g.get('latitude');b=g.get('longitude')
  if a is None or b is None:continue
  d=distance_km(lat,lon,a,b)
  if d<=radius:out.append({'name':p.get('title',''),'address':p.get('address',''),'rating':p.get('rating'),'priceLevel':p.get('price'),'distance':round(d,2),'latitude':a,'longitude':b,'mapsUrl':(p.get('links') or {}).get('directions')})
 return sorted(out,key=lambda x:x['distance'])[:10]
