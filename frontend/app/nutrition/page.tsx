"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FoodLogger } from "@/components/food-logger"
import { MealPlanner } from "@/components/meal-planner"
import { NutritionInsights } from "@/components/nutrition-insights"
import { Apple, Target, TrendingUp, Plus, Camera, Sparkles } from "lucide-react"

const dailyGoals = {
  calories: { current: 1847, target: 2200, unit: "cal" },
  protein: { current: 89, target: 120, unit: "g" },
  carbs: { current: 156, target: 200, unit: "g" },
  fat: { current: 67, target: 80, unit: "g" },
}

const todaysMeals = [
  {
    id: 1,
    name: "Breakfast",
    time: "8:00 AM",
    calories: 420,
    foods: [
      { name: "Oatmeal with berries", calories: 280, protein: 8, carbs: 45, fat: 6 },
      { name: "Greek yogurt", calories: 140, protein: 15, carbs: 8, fat: 4 },
    ],
  },
  {
    id: 2,
    name: "Lunch",
    time: "12:30 PM",
    calories: 650,
    foods: [
      { name: "Grilled chicken salad", calories: 450, protein: 35, carbs: 15, fat: 25 },
      { name: "Whole grain roll", calories: 200, protein: 6, carbs: 35, fat: 4 },
    ],
  },
  {
    id: 3,
    name: "Snack",
    time: "3:30 PM",
    calories: 180,
    foods: [{ name: "Apple with almond butter", calories: 180, protein: 6, carbs: 20, fat: 12 }],
  },
  {
    id: 4,
    name: "Dinner",
    time: "7:00 PM",
    calories: 597,
    foods: [
      { name: "Salmon with quinoa", calories: 420, protein: 30, carbs: 35, fat: 18 },
      { name: "Steamed broccoli", calories: 55, protein: 4, carbs: 8, fat: 1 },
      { name: "Mixed nuts", calories: 122, protein: 4, carbs: 4, fat: 11 },
    ],
  },
]

const waterIntake = { current: 6, target: 8, unit: "glasses" }

export default function NutritionPage() {
  const [showFoodLogger, setShowFoodLogger] = useState(false)
  const [showMealPlanner, setShowMealPlanner] = useState(false)

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100
    if (percentage >= 90) return "bg-green-500"
    if (percentage >= 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Nutrition</h1>
              <p className="text-sm text-muted-foreground">Track your meals and reach your nutrition goals</p>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button
                onClick={() => setShowFoodLogger(true)}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Log Food
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6">
          <Tabs defaultValue="today" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="planner">Meal Planner</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="recipes">Recipes</TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="space-y-6">
              {/* Daily Goals Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(dailyGoals).map(([key, goal], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="glass border-border/50">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-muted-foreground capitalize">{key}</h3>
                            <Badge variant="outline" className="text-xs">
                              {Math.round((goal.current / goal.target) * 100)}%
                            </Badge>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-foreground">
                              {goal.current}
                              <span className="text-sm font-normal text-muted-foreground ml-1">
                                / {goal.target} {goal.unit}
                              </span>
                            </div>
                            <Progress
                              value={(goal.current / goal.target) * 100}
                              className="mt-2 h-2"
                              indicatorClassName={getProgressColor(goal.current, goal.target)}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Water Intake */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card className="glass border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-foreground">
                      <div className="h-5 w-5 rounded-full bg-blue-500 mr-2" />
                      Water Intake
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-foreground">
                          {waterIntake.current}
                          <span className="text-sm font-normal text-muted-foreground ml-1">
                            / {waterIntake.target} {waterIntake.unit}
                          </span>
                        </div>
                        <Progress
                          value={(waterIntake.current / waterIntake.target) * 100}
                          className="mt-2 h-2 w-48"
                          indicatorClassName="bg-blue-500"
                        />
                      </div>
                      <Button size="sm" variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Glass
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Today's Meals */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">Today's Meals</h2>
                    <Button variant="outline" size="sm" onClick={() => setShowFoodLogger(true)}>
                      <Camera className="mr-2 h-4 w-4" />
                      Scan Food
                    </Button>
                  </div>
                  {todaysMeals.map((meal, index) => (
                    <motion.div
                      key={meal.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <Card className="glass border-border/50">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold text-foreground">{meal.name}</h3>
                                <p className="text-sm text-muted-foreground">{meal.time}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-foreground">{meal.calories}</div>
                                <div className="text-xs text-muted-foreground">calories</div>
                              </div>
                            </div>
                            <div className="space-y-1">
                              {meal.foods.map((food, foodIndex) => (
                                <div key={foodIndex} className="flex justify-between items-center text-sm">
                                  <span className="text-foreground">{food.name}</span>
                                  <span className="text-muted-foreground">{food.calories} cal</span>
                                </div>
                              ))}
                            </div>
                            <Button variant="ghost" size="sm" className="w-full">
                              <Plus className="mr-2 h-4 w-4" />
                              Add Food
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Actions & AI Suggestions */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-foreground">AI Suggestions</h2>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Card className="glass border-border/50 bg-gradient-to-r from-secondary/10 to-accent/10">
                      <CardHeader>
                        <CardTitle className="flex items-center text-foreground">
                          <Sparkles className="mr-2 h-5 w-5 text-secondary" />
                          Smart Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="p-3 rounded-lg bg-muted/50">
                          <h4 className="font-medium text-foreground mb-1">Protein Boost Needed</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            You're 31g short of your protein goal. Try adding:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">Greek yogurt</Badge>
                            <Badge variant="secondary">Protein shake</Badge>
                            <Badge variant="secondary">Chicken breast</Badge>
                          </div>
                        </div>

                        <div className="p-3 rounded-lg bg-muted/50">
                          <h4 className="font-medium text-foreground mb-1">Hydration Reminder</h4>
                          <p className="text-sm text-muted-foreground">
                            You need 2 more glasses of water to reach your daily goal.
                          </p>
                        </div>

                        <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                          <Target className="mr-2 h-4 w-4" />
                          Get Meal Suggestions
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Card className="glass border-border/50">
                      <CardHeader>
                        <CardTitle className="text-foreground">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          <Camera className="mr-2 h-4 w-4" />
                          Scan Food with Camera
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          <Apple className="mr-2 h-4 w-4" />
                          Browse Food Database
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          <TrendingUp className="mr-2 h-4 w-4" />
                          View Nutrition Trends
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start bg-transparent"
                          onClick={() => setShowMealPlanner(true)}
                        >
                          <Target className="mr-2 h-4 w-4" />
                          Plan Tomorrow's Meals
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="planner">
              <MealPlanner />
            </TabsContent>

            <TabsContent value="insights">
              <NutritionInsights />
            </TabsContent>

            <TabsContent value="recipes">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    name: "High-Protein Breakfast Bowl",
                    calories: 420,
                    protein: 28,
                    time: "15 min",
                    difficulty: "Easy",
                    image: "/placeholder.svg?key=recipe1",
                  },
                  {
                    name: "Mediterranean Quinoa Salad",
                    calories: 380,
                    protein: 15,
                    time: "20 min",
                    difficulty: "Easy",
                    image: "/placeholder.svg?key=recipe2",
                  },
                  {
                    name: "Grilled Salmon with Vegetables",
                    calories: 450,
                    protein: 35,
                    time: "25 min",
                    difficulty: "Medium",
                    image: "/placeholder.svg?key=recipe3",
                  },
                ].map((recipe, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="glass border-border/50 overflow-hidden group hover:shadow-lg transition-all duration-300">
                      <div className="relative">
                        <img
                          src={recipe.image || "/placeholder.svg"}
                          alt={recipe.name}
                          className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-secondary text-secondary-foreground">{recipe.difficulty}</Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-foreground mb-2">{recipe.name}</h3>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                          <span>{recipe.calories} cal</span>
                          <span>{recipe.protein}g protein</span>
                          <span>{recipe.time}</span>
                        </div>
                        <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                          View Recipe
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Food Logger Modal */}
      {showFoodLogger && <FoodLogger onClose={() => setShowFoodLogger(false)} />}

      {/* Meal Planner Modal */}
      {showMealPlanner && <MealPlanner onClose={() => setShowMealPlanner(false)} />}
    </div>
  )
}
