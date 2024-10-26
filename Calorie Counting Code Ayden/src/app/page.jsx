"use client";
import React from "react";
import * as MarkdownRenderer from "@/libraries/markdown-renderer";
import { useHandleStreamResponse } from "../utilities/runtime-helpers";

function MainComponent() {
  const [meals, setMeals] = useState(1);
  const [mealInputs, setMealInputs] = useState([
    { foods: [{ name: "", grams: "" }] },
  ]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [loading, setLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");

  // Personal Info States
  const [sex, setSex] = useState("male");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [activity, setActivity] = useState("sedentary");
  const [maintenanceCalories, setMaintenanceCalories] = useState(0);
  const handleStreamResponse = useHandleStreamResponse({
    onChunk: setStreamingMessage,
    onFinish: (message) => {
      setStreamingMessage("");
      const calories = parseFloat(message);
      if (!isNaN(calories)) {
        setTotalCalories(calories);
      }
    },
  });
  const addMeal = () => {
    setMeals((prev) => prev + 1);
    setMealInputs((prev) => [...prev, { foods: [{ name: "", grams: "" }] }]);
  };
  const addFoodToMeal = (mealIndex) => {
    const newMealInputs = [...mealInputs];
    newMealInputs[mealIndex].foods.push({ name: "", grams: "" });
    setMealInputs(newMealInputs);
  };

  const updateFoodInput = (mealIndex, foodIndex, field, value) => {
    const newMealInputs = [...mealInputs];
    newMealInputs[mealIndex].foods[foodIndex][field] = value;
    setMealInputs(newMealInputs);
  };

  const calculateCalories = async () => {
    setLoading(true);
    try {
      const foodDetails = mealInputs
        .map((meal) =>
          meal.foods.map((food) => `${food.name} (${food.grams}g)`).join(", ")
        )
        .join("; ");

      const response = await fetch("/integrations/chat-gpt/conversationgpt4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Calculate the total calories for these meals: ${foodDetails}. Only respond with the number.`,
            },
          ],
          stream: true,
        }),
      });
      handleStreamResponse(response);
    } catch (error) {
      console.error("Error calculating calories:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMaintenanceCalories = () => {
    let bmr = 0;
    if (sex === "male") {
      bmr =
        88.362 +
        13.397 * parseFloat(weight) +
        4.799 * parseFloat(height) -
        5.677 * parseFloat(age);
    } else {
      bmr =
        447.593 +
        9.247 * parseFloat(weight) +
        3.098 * parseFloat(height) -
        4.33 * parseFloat(age);
    }

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      very: 1.725,
      extra: 1.9,
    };

    setMaintenanceCalories(Math.round(bmr * activityMultipliers[activity]));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-roboto">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Daily Calorie Counter</h2>

          {mealInputs.map((meal, mealIndex) => (
            <div key={mealIndex} className="mb-6 p-4 border rounded-lg">
              <h3 className="text-lg font-semibold mb-2">
                Meal {mealIndex + 1}
              </h3>
              {meal.foods.map((food, foodIndex) => (
                <div key={foodIndex} className="flex gap-4 mb-2">
                  <input
                    type="text"
                    name={`food-${mealIndex}-${foodIndex}`}
                    placeholder="Food item"
                    className="flex-1 p-2 border rounded"
                    value={food.name}
                    onChange={(e) =>
                      updateFoodInput(
                        mealIndex,
                        foodIndex,
                        "name",
                        e.target.value
                      )
                    }
                  />
                  <input
                    type="number"
                    name={`grams-${mealIndex}-${foodIndex}`}
                    placeholder="Grams"
                    className="w-24 p-2 border rounded"
                    value={food.grams}
                    onChange={(e) =>
                      updateFoodInput(
                        mealIndex,
                        foodIndex,
                        "grams",
                        e.target.value
                      )
                    }
                  />
                </div>
              ))}
              <button
                onClick={() => addFoodToMeal(mealIndex)}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Food
              </button>
            </div>
          ))}

          <div className="flex gap-4 mb-4">
            <button
              onClick={addMeal}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Add Meal
            </button>
            <button
              onClick={calculateCalories}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              disabled={loading}
            >
              Calculate Total Calories
            </button>
          </div>

          {loading ? (
            <div className="text-gray-600">Calculating...</div>
          ) : (
            totalCalories > 0 && (
              <div className="text-xl font-semibold">
                Total Calories: {totalCalories}
              </div>
            )
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">
            Maintenance Calories Calculator
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="sex"
              className="p-2 border rounded"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <input
              type="number"
              name="height"
              placeholder="Height (cm)"
              className="p-2 border rounded"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />

            <input
              type="number"
              name="weight"
              placeholder="Weight (kg)"
              className="p-2 border rounded"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />

            <input
              type="number"
              name="age"
              placeholder="Age"
              className="p-2 border rounded"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />

            <select
              name="activity"
              className="p-2 border rounded"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
            >
              <option value="sedentary">Sedentary (little/no exercise)</option>
              <option value="light">Light (exercise 1-3 times/week)</option>
              <option value="moderate">
                Moderate (exercise 3-5 times/week)
              </option>
              <option value="very">
                Very Active (exercise 6-7 times/week)
              </option>
              <option value="extra">
                Extra Active (very intense exercise/physical job)
              </option>
            </select>

            <button
              onClick={calculateMaintenanceCalories}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Calculate Maintenance Calories
            </button>
          </div>

          {maintenanceCalories > 0 && (
            <div className="mt-4 text-xl font-semibold">
              Your daily maintenance calories: {maintenanceCalories}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainComponent;