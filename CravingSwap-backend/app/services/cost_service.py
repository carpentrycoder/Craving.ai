from decimal import Decimal,ROUND_HALF_UP
def calculate_savings(original:Decimal,actual:Decimal,relapse=False):
 if original<0 or actual<0: raise ValueError('Costs cannot be negative')
 if relapse: return Decimal('0.00')
 return max(Decimal('0'),original-actual).quantize(Decimal('.01'),rounding=ROUND_HALF_UP)
