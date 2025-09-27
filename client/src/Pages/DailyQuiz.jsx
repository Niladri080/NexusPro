import React, { useState, useEffect } from "react";
import { HelpCircle, CheckCircle, X, Trophy, Clock, ArrowLeft, Calendar } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const DailyQuiz = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const {user}=useUser();
  const navigate=useNavigate();
  const location=useLocation();
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [quizData,setquizData]=useState({});
  const [userStreak,setUserStreak]=useState();
  const [noQuestionToday, setNoQuestionToday] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(()=>{
    setIsLoading(true);
    axios.post(`${API_URL}/api/home/fetch-daily`,{
      userId:user.id
    })
    .then((res)=>{
      if (res.data && res.data.streak !== undefined) {
        setUserStreak(res.data.streak);
      }
      
      // Check if there are questions available
      if (!res.data.questions || res.data.questions.length === 0) {
        setNoQuestionToday(true);
      } else {
        setHasSubmitted(res.data.hasAnswered);
        setquizData(res.data.questions[0]);
      }
      setIsLoading(false);
    })
    .catch(err=>{
      console.error("Error fetching daily quiz:", err);
      // Check if the error indicates no question available
      if (err.response && err.response.status === 404) {
        setNoQuestionToday(true);
      } else {
        setHasSubmitted(true);
      }
      setIsLoading(false);
    })
  },[user,location.pathname])
  
  const handleRightAnswer = () => {
    axios.post(`${API_URL}/api/home/submit-right`, {
      userId: user.id
    })
    .then(res => {
      if (res.data && res.data.streak !== undefined) {
        setUserStreak(res.data.streak);
        toast.success("Right answer submitted successfully");
      }
    })
    .catch(err => {
      console.error("Submit right answer error:", err);
      toast.error("Error while submitting your answer");
    });
  };

  const handleWrongAnswer = () => {
    axios.post(`${API_URL}/api/home/submit-wrong`, {
      userId: user.id
    })
    .then(res => {
      if (res.data && res.data.streak !== undefined) {
        setUserStreak(res.data.streak);
        toast.success("Wrong answer, Come back tomorrow");
      }
    })
    .catch(err => {
      console.error("Submit wrong answer error:", err);
      toast.error("Error while submitting your answer");
    });
  };

  const handleOptionClick = (optionIndex) => {
    if (hasAnswered) return;
    const correct = optionIndex === quizData.correctAnswer;
    setSelectedOption(optionIndex);
    setIsCorrect(correct);
    setShowResult(true);
    setHasAnswered(true);
    if (correct) {
      handleRightAnswer();
    } else {
      handleWrongAnswer();
    }
  };

  const handleReturnToLearning = () => {
    navigate('/my-learning'); // Adjust the path to match your learning page route
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
        {/* Return Button */}
        <div className="mb-8">
          <button
            onClick={handleReturnToLearning}
            className="flex items-center gap-2 px-4 py-2 bg-[#1c1c1c] border border-gray-700/50 rounded-lg hover:border-blue-500 hover:bg-gray-800/50 transition-all duration-300 text-gray-300 hover:text-blue-400"
          >
            <ArrowLeft size={18} />
            Return to Learning
          </button>
        </div>

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
            
            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-400">Loading today's quiz...</p>
              </div>
            )}

            {/* No Question Available */}
            {!isLoading && noQuestionToday && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="text-orange-400" size={32} />
                </div>
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">
                  No Quiz Available Today
                </h2>
                <p className="text-gray-400 text-lg mb-6">
                  There's no question available for today. Our team is working on bringing you fresh content!
                </p>
                <p className="text-gray-500">
                  Check back tomorrow for a new challenge.
                </p>
              </div>
            )}

            {/* Already Submitted */}
            {!isLoading && !noQuestionToday && hasSubmitted && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="text-green-400" size={32} />
                </div>
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">
                  Quiz Completed for Today!
                </h2>
                <p className="text-gray-400 text-lg mb-6">
                  You've already answered today's question. Great job!
                </p>
                <p className="text-gray-500">
                  Come back tomorrow for a new challenge.
                </p>
              </div>
            )}

            {/* Active Quiz */}
            {!isLoading && !noQuestionToday && !hasSubmitted && (
              <>
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

                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-200 leading-relaxed">
                    {quizData.question}
                  </h2>
                </div>

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
              </>
            )}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 gap-6 mt-8">
            <div className="bg-[#1c1c1c] rounded-xl border border-gray-700/50 p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">{userStreak==0?'-':userStreak}</div>
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

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default DailyQuiz;