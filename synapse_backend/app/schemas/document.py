from pydantic import BaseModel
from typing import List


class DocumentBase(BaseModel):
    file_name: str
    status: str

class DocumentCreate(BaseModel):
    # Döküman oluştururken sadece dosya adı ve classroom_id gerekir.
    # Ancak API endpoint'i bunları ayrı aldığı için bu şema doğrudan kullanılmaz.
    # Yine de tutarlılık için burada bırakıyoruz.
    file_name: str
    classroom_id: int

class Document(DocumentBase):
    id: int
    classroom_id: int

    class Config:
        from_attributes = True

class QuickSummaryResponse(BaseModel):
    summary: str
    headings: List[str]        