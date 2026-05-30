from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.parser import extract_text_from_pdf # Your existing parser
from app.services.rag import execute_rag_pipeline     # The new RAG engine

router = APIRouter()

@router.post("/analyze")
async def analyze_document(file: UploadFile = File(...), query: str = Form(...)):
    try:
        # 1. Extract raw text (using your existing PyPDF cryptography setup)
        raw_text = await extract_text_from_pdf(file)
        
        # 2. Pass the massive text to the RAG pipeline to be chunked and analyzed
        analysis_result = await execute_rag_pipeline(raw_text, query)
        
        return {"analysis": analysis_result}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))