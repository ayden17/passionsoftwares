"use client";
import React from "react";

function MainComponent() {
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    work: "",
    interests: [],
  });

  const workOptions = [
    "Designer",
    "Developer",
    "Product Manager",
    "Founder",
    "Other",
  ];
  const interestOptions = [
    "Technology",
    "Design",
    "Business",
    "Marketing",
    "Science",
    "Arts",
    "Education",
  ];

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 w-full">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => updateFormData("name", e.target.value)}
              className="w-full p-3 rounded-lg bg-[#2D2D2D] border border-[#3D3D3D] text-white"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => updateFormData("email", e.target.value)}
              className="w-full p-3 rounded-lg bg-[#2D2D2D] border border-[#3D3D3D] text-white"
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 w-full">
            {workOptions.map((option) => (
              <button
                key={option}
                onClick={() => updateFormData("work", option)}
                className={`w-full p-3 rounded-lg border ${
                  formData.work === option
                    ? "bg-[#3D3D3D] border-[#5D5D5D]"
                    : "bg-[#2D2D2D] border-[#3D3D3D]"
                } text-white text-left`}
              >
                {option}
              </button>
            ))}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 w-full">
            {interestOptions.map((option) => (
              <button
                key={option}
                onClick={() => {
                  const newInterests = formData.interests.includes(option)
                    ? formData.interests.filter((i) => i !== option)
                    : [...formData.interests, option];
                  updateFormData("interests", newInterests);
                }}
                className={`w-full p-3 rounded-lg border ${
                  formData.interests.includes(option)
                    ? "bg-[#3D3D3D] border-[#5D5D5D]"
                    : "bg-[#2D2D2D] border-[#3D3D3D]"
                } text-white text-left`}
              >
                {option}
              </button>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#1A1A1A]">
      <div className="w-1/2 flex flex-col p-12">
        <div className="flex items-center space-x-2 text-[#666666] font-mono text-sm">
          {[1, 2, 3].map((num) => (
            <React.Fragment key={num}>
              <span className={step >= num ? "text-white" : ""}>
                Step {num}
              </span>
              {num < 3 && <span>→</span>}
            </React.Fragment>
          ))}
        </div>

        <div className="flex-grow flex flex-col items-center justify-center max-w-md mx-auto w-full">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-12">
            {step === 1 && "Let's get started"}
            {step === 2 && "What do you do?"}
            {step === 3 && "Pick your interests"}
          </h1>

          {renderStep()}

          <div className="flex justify-between w-full mt-8">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-3 rounded-lg bg-[#2D2D2D] text-white hover:bg-[#3D3D3D]"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-lg bg-[#2D2D2D] text-white hover:bg-[#3D3D3D] ml-auto"
            >
              {step === 3 ? "Finish" : "Continue"}
            </button>
          </div>
        </div>
      </div>

      <div className="w-1/2 bg-[#2D2D2D]">
        <img
          src="/placeholder.jpg"
          alt="Onboarding illustration"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default MainComponent;