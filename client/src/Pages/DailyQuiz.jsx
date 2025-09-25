import React, { useState, useEffect } from "react";
import { HelpCircle, CheckCircle, X, Trophy, Clock } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const DailyQuiz = () => {
  const {user}=useUser();
  const location=useLocation();
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [quizData,setquizData]=useState({});
  useEffect(()=>{
    axios.post("http://localhost:4000/api/home/fetch-daily",{
      userId:user.id
    })
    .then((res)=>{
      setHasAnswered(res.data.hasAnswered);
      setquizData(res.data.questions[0]);
    })
    .catch(err=>{
      setHasAnswered(true);
      toast.error("Error while loading daily question");
    })
  },[user,location.pathname])
  const handleOptionClick = (optionIndex) => {
    if (hasAnswered) return;
    
    setSelectedOption(optionIndex);
    setIsCorrect(optionIndex === quizData.correctAnswer);
    setShowResult(true);
    setHasAnswered(true);
  };

  const resetQuiz = () => {
    setSelectedOption(null);
    setShowResult(false);
    setIsCorrect(false);
    setHasAnswered(false);
  };

  const getOptionClass = (optionIndex) => {
    if (!showResult) {
      return "bg-[#1c1c1c] border-gray-700/50 hover:border-blue-500 hover:bg-gray-800/50 cursor-pointer";
    }
    
    if (optionIndex === quizData.correctAnswer) {
      return "bg-green-900/30 border-green-500 text-green-300";
    }
    
    if (optionIndex === selectedOption && !isCorrect) {
      return "bg-red-900/30 border-red-500 text-red-300";
    }
    
    return "bg-[#1c1c1c] border-gray-700/30 text-gray-500";
  };

  return (
    <div className="bg-[#0a0a0c] text-white font-sans min-h-screen relative">
      {/* Background Elements */}
      <div
        className="absolute inset-0 bg-cover bg-fixed opacity-10"
        style={{
          backgroundImage: 'url("/images/space.png")',
          backgroundPosition: "center top",
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-blue-900/10"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none z-0"></div>

      <div className="relative z-10 container mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HelpCircle size={32} className="text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Daily Quiz Challenge
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Test your knowledge with our daily tech quiz. One question, one chance to shine!
          </p>
        </div>

        {/* Quiz Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1c1c1c] rounded-2xl border border-gray-700/50 shadow-2xl p-8 lg:p-12">
            
            {/* Quiz Header */}
            <div className="flex items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Clock className="text-blue-400" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-200">Today's Question</h3>
                  <p className="text-sm text-gray-400">{quizData.topic}</p>
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-200 leading-relaxed">
                {quizData.question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-4 mb-8">
              {quizData.options?.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleOptionClick(index)}
                  className={`
                    p-6 rounded-xl border-2 transition-all duration-300 transform
                    ${getOptionClass(index)}
                    ${!hasAnswered ? 'hover:scale-[1.02]' : ''}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                      ${showResult && index === quizData.correctAnswer 
                        ? 'bg-green-500 text-white' 
                        : showResult && index === selectedOption && !isCorrect
                        ? 'bg-red-500 text-white'
                        : 'bg-blue-500/20 text-blue-400'
                      }
                    `}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-lg">{option}</span>
                    
                    {/* Icons for correct/incorrect */}
                    {showResult && index === quizData.correctAnswer && (
                      <CheckCircle className="text-green-500 ml-auto" size={20} />
                    )}
                    {showResult && index === selectedOption && !isCorrect && (
                      <X className="text-red-500 ml-auto" size={20} />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Result Message */}
            {showResult && (
              <div className="animate-fade-in-up">
                {isCorrect ? (
                  <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Trophy className="text-yellow-400" size={24} />
                      <h3 className="text-2xl font-bold text-green-400">Congratulations! 🎉</h3>
                    </div>
                    <p className="text-green-300 text-lg mb-3">
                      Excellent work! You got it right.
                    </p>
                    <p className="text-gray-300">
                      <strong>Explanation:</strong> {quizData.explanation}
                    </p>
                  </div>
                ) : (
                  <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <X className="text-red-400" size={24} />
                      <h3 className="text-2xl font-bold text-red-400">Not quite right!</h3>
                    </div>
                    <p className="text-red-300 text-lg mb-3">
                      Come back tomorrow for another chance! 
                    </p>
                    <p className="text-gray-300 mb-3">
                      <strong>The correct answer was:</strong> {quizData.options[quizData.correctAnswer]}
                    </p>
                    <p className="text-gray-300">
                      <strong>Explanation:</strong> {quizData.explanation}
                    </p>
                  </div>
                )}


              </div>
            )}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 gap-6 mt-8">
            <div className="bg-[#1c1c1c] rounded-xl border border-gray-700/50 p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">-</div>
              <div className="text-gray-400">Current Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles matching your landing page */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .bg-grid-pattern {
          background-image: linear-gradient(
              to right,
              rgba(59, 130, 246, 0.05) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(59, 130, 246, 0.05) 1px,
              transparent 1px
            );
          background-size: 30px 30px;
        }
      `}</style>
    </div>
  );
};

export default DailyQuiz;