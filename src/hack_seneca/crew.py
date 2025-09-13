from crewai import Agent, Crew, Process, Task
from crewai.llm import LLM
import os
from dotenv import load_dotenv

load_dotenv()

class FitnessCrew:
    """Fitness crew with CrewAI's built-in memory"""
    
    def __init__(self):
        # Configure Azure LLM
        self.llm = LLM(
            model=os.getenv("model"),
            api_key=os.getenv("AZURE_AI_API_KEY"),
            base_url=os.getenv("AZURE_AI_ENDPOINT"),
            api_version=os.getenv("AZURE_AI_API_VERSION"),
        )

    def create_assistant_agent(self):
        """Create the fitness assistant agent"""
        return Agent(
            role="Virtual Fitness Assistant & Coach",
            goal="Provide accurate, safe, and motivating fitness guidance tailored to the user's goals and preferences",
            backstory=(
                "You're a knowledgeable and supportive fitness assistant. You help users with workout planning, "
                "exercise form cues, progressive overload principles, recovery, and nutrition basics. You adapt "
                "to users' experience levels and time constraints, and you remember preferences to personalize "
                "future advice. Avoid medical diagnoses; when health risks appear, suggest consulting a professional."
            ),
            llm=self.llm,
            verbose=True,
            memory=True,
        )

    def create_assistant_task(self):
        """Create the fitness assistant task"""
        return Task(
            description=(
                "Respond to the user's message: {user_message}\n\n"
                "User ID: {user_id}\n\n"
                "USER PROFILE & FITNESS DATA:\n"
                "Profile: {user_profile}\n"
                "Recent Activities: {user_activities}\n"
                "Body Measurements: {user_measurements}\n"
                "Nutrition Intake: {user_nutrition}\n\n"
                "Conversation History (for context):\n{context}\n\n"
                "IMPORTANT: Use the user's specific fitness data above to provide highly personalized advice. "
                "Always reference their fitness level, goals, recent activities, and measurements when relevant. "
                "DO NOT ask for information that is already provided in their profile data. "
                "If the user asks about workouts, provide structured plans tailored to their specific fitness level and goals. "
                "Reference their recent progress, measurements, or activity patterns to show you understand their current state. "
                "Keep responses focused and actionable. Prioritize safety and suggest professional consultation for health concerns."
            ),
            expected_output=(
                "A highly personalized, friendly, and actionable response that clearly demonstrates knowledge of the user's "
                "specific fitness data. Always reference relevant data points (fitness level, goals, recent activities, measurements) "
                "when providing recommendations. If providing workout plans, use clear formatting and adjust difficulty based on "
                "their specific fitness level and goals. Keep responses concise but personalized."
            ),
            agent=self.create_assistant_agent(),
        )

    def chat_crew(self):
        """Create a chat crew with CrewAI's built-in memory"""
        return Crew(
            agents=[self.create_assistant_agent()],
            tasks=[self.create_assistant_task()],
            process=Process.sequential,
            verbose=True,
            memory=True,  # Use CrewAI's built-in memory system
        )
