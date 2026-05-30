from langchain_openai import ChatOpenAI
from langchain_tavily import TavilySearch
from langchain.agents import create_agent
from app.core.config import settings

def run_insurance_analysis(document_text: str, user_query: str) -> str:
    """Initializes the LLM, binds tools, and executes the LangGraph reasoning loop."""
    
    if not settings.OPENAI_API_KEY or not settings.TAVILY_API_KEY:
        raise ValueError("Missing API keys in environment.")

    llm = ChatOpenAI(model="gpt-4o", temperature=0)
    search_tool = TavilySearch(max_results=3)
    tools = [search_tool]

    system_prompt = f"""You are a Senior Insurance Analyst AI. 
    You have been provided with the following extracted text from an uploaded insurance document:
    
    <document_context>
    {document_text}
    </document_context>
    
    Analyze the document to thoroughly answer the user's query. 
    CRITICAL RULE: If the user's query asks for regulatory standards, updated state laws, 
    or external market metrics that are NOT explicitly detailed in the <document_context>, 
    you MUST use the tavily_search_results_json tool to find the missing information before answering.
    If you use external information, clearly state that it was retrieved via web search.
    Do not hallucinate clauses or external facts."""

    agent = create_agent(
        model=llm, 
        tools=tools, 
        system_prompt=system_prompt  
    )

    response = agent.invoke({"messages": [("human", user_query)]})
    return response["messages"][-1].content