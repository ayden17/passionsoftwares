"use client";
import React from "react";

function MainComponent() {
  const [cards, setCards] = React.useState([
    { front: "", back: "", isFlipped: false },
  ]);
  const [currentCard, setCurrentCard] = React.useState(0);
  const [isEditing, setIsEditing] = React.useState(true);
  const flipCard = () => {
    setCards(
      cards.map((card, idx) =>
        idx === currentCard ? { ...card, isFlipped: !card.isFlipped } : card
      )
    );
  };
  const updateCard = (side, value) => {
    setCards(
      cards.map((card, idx) =>
        idx === currentCard ? { ...card, [side]: value } : card
      )
    );
  };
  const addCard = () => {
    setCards([...cards, { front: "", back: "", isFlipped: false }]);
    setCurrentCard(cards.length);
    setIsEditing(true);
  };
  const saveChanges = () => {
    setIsEditing(false);
  };
  const shuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentCard(0);
  };
  const navigate = (direction) => {
    const newIndex = currentCard + direction;
    if (newIndex >= 0 && newIndex < cards.length) {
      setCurrentCard(newIndex);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-roboto">
      <div className="max-w-2xl mx-auto">
        {isEditing ? (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
            <input
              type="text"
              name="front"
              value={cards[currentCard].front}
              onChange={(e) => updateCard("front", e.target.value)}
              placeholder="Enter the front of the flashcard"
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="text"
              name="back"
              value={cards[currentCard].back}
              onChange={(e) => updateCard("back", e.target.value)}
              placeholder="Enter the back of the flashcard"
              className="w-full p-2 mb-4 border rounded"
            />
          </div>
        ) : (
          <div
            onClick={flipCard}
            className="bg-white rounded-lg shadow-lg p-6 mb-4 min-h-[200px] flex items-center justify-center cursor-pointer hover:shadow-xl transition-shadow duration-300"
            style={{
              perspective: "1000px",
              transformStyle: "preserve-3d",
              animation: cards[currentCard].isFlipped
                ? "flipCard 0.6s forwards"
                : "flipCardBack 0.6s forwards",
            }}
          >
            <div
              className="text-xl text-center"
              style={{
                backfaceVisibility: "hidden",
                transform: cards[currentCard].isFlipped
                  ? "rotateY(180deg)"
                  : "rotateY(0deg)",
              }}
            >
              {cards[currentCard].isFlipped
                ? cards[currentCard].back
                : cards[currentCard].front}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="text-2xl px-4 py-2 bg-blue-500 text-white rounded"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="text-gray-600">
            {currentCard + 1} / {cards.length}
          </div>
          <button
            onClick={() => navigate(1)}
            className="text-2xl px-4 py-2 bg-blue-500 text-white rounded"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        <div className="flex justify-center gap-4">
          {isEditing ? (
            <button
              onClick={saveChanges}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-yellow-500 text-white rounded"
            >
              Edit Card
            </button>
          )}
          <button
            onClick={addCard}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add New Card
          </button>
          <button
            onClick={shuffle}
            className="px-4 py-2 bg-purple-500 text-white rounded"
          >
            Shuffle
          </button>
        </div>
      </div>
      <style jsx global>{`
        @keyframes flipCard {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(180deg); }
        }
        @keyframes flipCardBack {
          0% { transform: rotateY(180deg); }
          100% { transform: rotateY(0deg); }
        }
      `}</style>
    </div>
  );
}

export default MainComponent;