import os
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from openai import AsyncOpenAI
from dotenv import load_dotenv
load_dotenv()

# Ensure your OPENAI_API_KEY is exported in your terminal or loaded via python-dotenv
client = AsyncOpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

async def execute_rag_pipeline(raw_text: str, query: str) -> str:
    """
    Slices a massive document, finds the relevant parts, and answers the query.
    """
    # 1. Slice the document into 2,000-character chunks with 200-character overlaps (so sentences don't get cut in half)
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=2000, 
        chunk_overlap=200
    )
    chunks = text_splitter.split_text(raw_text)

    # 2. Convert text chunks into mathematical vectors (Embeddings)
    embeddings = OpenAIEmbeddings()
    
    # 3. Build a temporary local Vector Database using FAISS
    vectorstore = FAISS.from_texts(texts=chunks, embedding=embeddings)

    # 4. Search the Vector DB for the chunks that best match the user's query
    # "k=5" means we only grab the top 5 most relevant chunks to send to OpenAI
    retriever = vectorstore.as_retriever(search_kwargs={"k": 5})
    relevant_docs = retriever.invoke(query)
    
    # Combine the winning chunks into a single string of context
    retrieved_context = "\n\n---\n\n".join([doc.page_content for doc in relevant_docs])

    # 5. Send only the retrieved context to GPT-4o
    system_prompt = (
        "You are an expert Insurance AI Agent. You must answer the user's query "
        "relying strictly on the provided document context. If the answer is not "
        "in the context, explicitly state that you cannot find it in the provided policy."
    )
    
    user_prompt = f"Document Context:\n{retrieved_context}\n\nUser Query: {query}"

    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.2 # Low temperature for factual, analytical responses
    )

    return response.choices[0].message.content