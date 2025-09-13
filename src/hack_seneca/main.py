#!/usr/bin/env python
import sys
import os
import warnings
from collections import deque

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from crew import FitnessCrew
except ImportError as e:
    print(f"Error: Could not import required modules: {e}")
    print("Make sure all files are in the same directory")
    sys.exit(1)

warnings.filterwarnings("ignore")

def chat():
    """Start the conversational fitness chatbot"""
    print("🏋️‍♂️ Fitness Chatbot Activated!")
    print("=" * 50)
    
    print("\n⚡ Initializing fitness assistant...")
    
    # Initialize fitness crew
    fitness_crew = FitnessCrew()
    crew_instance = fitness_crew.chat_crew()
    
    print("✅ Fitness assistant ready!")
    print("\n" + "=" * 50)
    print("💬 Start chatting! Type 'exit', 'quit', or 'bye' to end")
    print("� Ask about workouts, nutrition, progress, or anything fitness-related")
    print("=" * 50 + "\n")
    
    # Initialize conversation history for current session
    conversation_history = deque(maxlen=6)  # Keep last 6 exchanges for context

    while True:
        try:
            user_input = input("You: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\n👋 Goodbye! Stay consistent and take care.")
            break

        if user_input.lower() in {"exit", "quit", "bye"}:
            print("👋 Goodbye! Stay consistent and take care.")
            break

        if not user_input:
            continue

        # Add user message to session history
        conversation_history.append(f"User: {user_input}")

        # Prepare context from recent conversation history
        recent_context = "\n".join(conversation_history)

        # Inputs for the assistant
        inputs = {
            "user_message": user_input,
            "context": recent_context,
        }

        try:
            # Get response from crew
            response = crew_instance.kickoff(inputs=inputs)
            response_text = str(response).strip()
            
            # Clean up response text (remove any extra formatting)
            if response_text.startswith("Assistant:"):
                response_text = response_text[10:].strip()
            
            # Add assistant response to session history
            conversation_history.append(f"Assistant: {response_text}")
            
            print(f"\nFitness Coach: {response_text}\n")
            
        except Exception as e:
            error_msg = f"I encountered an error: {str(e)}"
            print(f"\nFitness Coach: {error_msg}\n")
            print("Please check your API keys and try again.")
            break

if __name__ == "__main__":
    chat()