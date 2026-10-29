from pydantic import BaseModel,ConfigDict
def camel(s):
 p=s.split('_'); return p[0]+''.join(x.title() for x in p[1:])
class APIModel(BaseModel): model_config=ConfigDict(alias_generator=camel,populate_by_name=True,from_attributes=True)
