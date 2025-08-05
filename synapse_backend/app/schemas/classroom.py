from pydantic import BaseModel
from typing import List
from .document import Document # Az önce oluşturduğumuz Document şemasını import ediyoruz

class ClassroomBase(BaseModel):
    name: str

class ClassroomCreate(ClassroomBase):
    pass

class Classroom(ClassroomBase):
    id: int
    documents: List[Document] = [] # Bu dersliğe ait dokümanları da göstereceğiz

    class Config:
        from_attributes = True