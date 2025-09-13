from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import json
import re
import os
from datetime import datetime

# Import your existing modules
from .main import load_user_data, login
from .crew import FitnessCrew  

app = FastAPI(title="Fitness Coach AI API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables to store current user session
current_user_data = None
current_user_id = None

# Pydantic models for request/response
class LoginRequest(BaseModel):
    user_id: str

class LoginResponse(BaseModel):
    success: bool
    message: str
    user_data: Optional[Dict[str, Any]] = None

class ChatRequest(BaseModel):
    message: str
    user_id: str

class ChatResponse(BaseModel):
    response: str
    timestamp: datetime

class UserDataResponse(BaseModel):
    user_data: Dict[str, Any]

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Fitness Coach AI API", "status": "running"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now()}

@app.post("/api/login", response_model=LoginResponse)
async def api_login(request: LoginRequest):
    """Handle user login and load user data"""
    global current_user_data, current_user_id
    
    try:
        # Use the existing login function
        user_id = request.user_id.strip()
        
        # Validate user ID format
        if not re.match(r'^user_\d{5}$', user_id):
            return LoginResponse(
                success=False,
                message="Invalid user ID format. Please use format: user_XXXXX"
            )
        
        # Load user data
        print(f"🔄 Starting to load user data for {user_id}")
        user_data = load_user_data(user_id)
        print(f"✅ User data loaded successfully for {user_id}")
        
        if user_data:
            current_user_data = user_data
            current_user_id = user_id
            profile_name = "User"
            if user_data.get('profile'):
                profile_name = user_data['profile'].get('name', 'User')
            return LoginResponse(
                success=True,
                message=f"Welcome back, {profile_name}!",
                user_data=user_data
            )
        else:
            return LoginResponse(
                success=False,
                message="User not found. Please check your user ID."
            )
    
    except Exception as e:
        print(f"❌ Login error: {str(e)}")
        return LoginResponse(
            success=False,
            message=f"Login failed: {str(e)}"
        )

@app.post("/api/chat", response_model=ChatResponse)
async def api_chat(request: ChatRequest):
    """Handle chat messages with the AI fitness coach"""
    global current_user_data, current_user_id
    
    try:
        # Check if user is logged in
        if not current_user_id or current_user_id != request.user_id:
            raise HTTPException(status_code=401, detail="User not authenticated")
        
        if not current_user_data:
            raise HTTPException(status_code=400, detail="User data not loaded")
        
        # Initialize the CrewAI fitness coach
        fitness_crew = FitnessCrew()
        crew_instance = fitness_crew.chat_crew()
        
        # Prepare inputs in the format expected by the crew
        inputs = {
            "user_input": request.message,
            "user_id": request.user_id,
            "user_profile": current_user_data.get('profile', {}),
            "user_activities": current_user_data.get('activities', []),
            "user_measurements": current_user_data.get('measurements', []),
            "user_nutrition": current_user_data.get('nutrition', [])
        }
        
        # Get response from CrewAI
        result = crew_instance.kickoff(inputs=inputs)
        response_text = str(result).strip()
        
        # Clean up response text (remove any extra formatting)
        if response_text.startswith("Assistant:"):
            response_text = response_text[10:].strip()
        
        return ChatResponse(
            response=response_text,
            timestamp=datetime.now()
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

@app.get("/api/user-data", response_model=UserDataResponse)
async def api_get_user_data():
    """Get current user data"""
    global current_user_data
    
    if not current_user_data:
        raise HTTPException(status_code=401, detail="User not authenticated")
    
    return UserDataResponse(user_data=current_user_data)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000, reload=True)