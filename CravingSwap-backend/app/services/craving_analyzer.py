import re
from decimal import Decimal
from app.schemas.domain import Analysis
def fallback(text):
 clean=re.sub(r"[^a-zA-Z0-9 '-]",'',text).lower(); cat=next((x for x in ['pizza','burger','vadapav','chocolate','chips','biryani'] if x in clean),'other'); flavors=[x for x in ['spicy','sweet','salty','cheesy','savory','tangy'] if x in clean] or ['savory']; textures=[x for x in ['crispy','crunchy','creamy','melty','soft'] if x in clean]; food=clean.replace('i am','').replace('craving','').replace('i want','').strip()
 return Analysis(normalized_food=food[:150],category=cat,flavors=flavors,textures=textures,price_min=Decimal('80'),price_max=Decimal('300'),suggested_search_query='healthier '+food,confidence=.45)
