import io
from pypdf import PdfReader
from fastapi import UploadFile

async def extract_text_from_pdf(file: UploadFile) -> str:
    # 1. Extract the raw binary bytes from the FastAPI UploadFile object
    file_bytes = await file.read()
    
    # 2. Convert those bytes into a file-like object in memory
    pdf_stream = io.BytesIO(file_bytes)
    
    # 3. Pass the byte stream to the PDF reader
    reader = PdfReader(pdf_stream)
    
    # 4. Extract the text chapter by chapter (page by page)
    extracted_text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            extracted_text += page_text + "\n\n"
            
    return extracted_text