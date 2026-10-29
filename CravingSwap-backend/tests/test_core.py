from decimal import Decimal
import pytest
from pydantic import ValidationError
from app.services.cost_service import calculate_savings
from app.services.craving_analyzer import fallback
from app.schemas.domain import CravingRequest
def test_savings():assert calculate_savings(Decimal('150'),Decimal('60'))==Decimal('90.00')
def test_never_negative():assert calculate_savings(Decimal('50'),Decimal('80'))==Decimal('0.00')
def test_relapse():assert calculate_savings(Decimal('150'),Decimal('60'),True)==Decimal('0.00')
def test_analyzer():assert fallback('spicy cheese pizza').category=='pizza'
def test_coordinate_pair():
 with pytest.raises(ValidationError):CravingRequest(craving='pizza',latitude=19)
