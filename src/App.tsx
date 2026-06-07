import React, { useState, useEffect } from 'react';
import { questions } from './data/questions';

export default function App() {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 22);
  const [isFinished, setIsFinished] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (isFinished) return;
    if (timeLeft <= 0) {
      setIsFinished(true);
      setShowSummary(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(t => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished, timeLeft]);

  const handleFinish = () => {
    setIsFinished(true);
    setShowSummary(true);
  };

  const handleRestart = () => {
    setIsFinished(false);
    setShowSummary(false);
    setAnswers({});
    setCurrentQuestionIdx(0);
    setTimeLeft(14 * 60 + 22);
  };

  const score = questions.reduce((acc, q, idx) => {
    return acc + (answers[idx] === q.correctAnswer ? 1 : 0);
  }, 0);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentQuestionIdx];
  
  const handleOptionSelect = (optionIdx: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIdx]: optionIdx
    }));
  };

  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(prev => prev - 1);
    }
  };

  const getOptionLetters = (idx: number) => {
    const letters = ['أ', 'ب', 'ج', 'د'];
    return letters[idx] || '';
  };

  return (
    <div dir="rtl" className="bg-slate-50 min-h-screen flex flex-col font-sans overflow-hidden">
      <header className="h-20 w-full flex items-center justify-between px-10 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white rounded-sm rotate-45"></div>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">كيمياء العرب <span className="text-indigo-600 font-medium text-sm">| الاختبار الدوري</span></h1>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-xs text-slate-400 uppercase font-semibold">
              {isFinished ? 'النتيجة' : 'الوقت المتبقي'}
            </span>
            <span className="text-lg font-mono font-bold text-indigo-600">
              {isFinished ? `${score} / ${questions.length}` : formatTime(timeLeft)}
            </span>
          </div>
          <div className="h-10 w-px bg-slate-200 mx-2"></div>
          {isFinished ? (
            <button onClick={handleRestart} className="px-6 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-bold shadow-lg hover:bg-indigo-700 transition-all cursor-pointer">إعادة الاختبار</button>
          ) : (
            <button onClick={handleFinish} className="px-6 py-2.5 bg-slate-800 text-white rounded-full text-sm font-bold shadow-lg hover:bg-slate-700 transition-all cursor-pointer">إنهاء الاختبار</button>
          )}
        </div>
      </header>

      <main className="flex-1 flex gap-8 p-10 overflow-hidden h-[calc(100vh-5rem)]">
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center justify-between shrink-0">
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs font-bold uppercase">المستوى الأول</span>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-md text-xs font-bold uppercase">الكيمياء العضوية</span>
            </div>
            <span className="text-slate-500 text-sm font-medium">السؤال {currentQuestionIdx + 1} من {questions.length}</span>
          </div>

          <div className="flex-1 glass shadow-card rounded-[40px] p-8 md:p-12 flex flex-col justify-center gap-8 relative overflow-y-auto">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-50 rounded-full opacity-50 pointer-events-none"></div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-snug relative z-10 shrink-0">
              {currentQ.question}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10 shrink-0">
              {currentQ.options.map((opt, idx) => {
                const isSelected = answers[currentQuestionIdx] === idx;
                
                let btnStateClasses = '';
                let indexStateClasses = '';

                if (isFinished) {
                  const isCorrectOption = currentQ.correctAnswer === idx;
                  if (isCorrectOption) {
                    btnStateClasses = 'border-green-500 ring-4 ring-green-50 bg-green-50 z-10';
                    indexStateClasses = 'bg-green-500 text-white';
                  } else if (isSelected) {
                    btnStateClasses = 'border-red-500 ring-4 ring-red-50 bg-red-50 z-10';
                    indexStateClasses = 'bg-red-500 text-white';
                  } else {
                    btnStateClasses = 'border-slate-100 opacity-60';
                    indexStateClasses = 'bg-slate-100 text-slate-500';
                  }
                } else {
                  if (isSelected) {
                    btnStateClasses = 'border-indigo-600 ring-4 ring-indigo-50 bg-slate-50';
                    indexStateClasses = 'bg-indigo-600 text-white';
                  } else {
                    btnStateClasses = 'border-slate-100';
                    indexStateClasses = 'bg-slate-100 text-slate-500 group-hover:bg-indigo-600 group-hover:text-white';
                  }
                }
                
                return (
                  <button 
                    key={idx}
                    disabled={isFinished}
                    onClick={() => handleOptionSelect(idx)}
                    className={`option-btn min-h-20 text-right px-6 py-2 border-2 rounded-2xl flex items-center gap-4 transition-all group bg-white shadow-sm ${!isFinished && 'cursor-pointer'} ${btnStateClasses}`}
                  >
                    <span 
                      className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-colors shrink-0 ${indexStateClasses}`}
                    >
                      {getOptionLetters(idx)}
                    </span>
                    <span 
                      className={`text-lg md:text-xl ${isSelected ? 'font-bold text-slate-800' : 'font-medium text-slate-700'} leading-snug`}
                      dir="rtl"
                    >
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between px-2 shrink-0">
            <button 
              onClick={handlePrev}
              disabled={currentQuestionIdx === 0}
              className={`flex items-center gap-2 font-bold transition-colors ${currentQuestionIdx === 0 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-indigo-600 cursor-pointer'}`}
            >
              <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg> 
              السؤال السابق
            </button>
            <button 
              onClick={handleNext}
              disabled={currentQuestionIdx === questions.length - 1}
              className={`px-10 py-4 rounded-2xl font-bold text-lg transition-all
                ${currentQuestionIdx === questions.length - 1 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 cursor-pointer'
                }`}
            >
              السؤال التالي
            </button>
          </div>
        </div>

        <aside className="w-72 hidden lg:flex flex-col gap-6 shrink-0 h-full">
          <div className="glass shadow-card rounded-3xl p-6 flex flex-col gap-4 max-h-[60%] flex-shrink-0">
            <h3 className="font-bold text-slate-800">خريطة الأسئلة</h3>
            <div className="grid grid-cols-5 gap-3 overflow-y-auto pr-1 pb-2">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentQuestionIdx;
                const isAnswered = answers[idx] !== undefined;
                
                let btnClass = "w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-colors cursor-pointer ";
                
                if (isFinished) {
                  const isCorrect = answers[idx] === q.correctAnswer;
                  
                  if (isCurrent) {
                    btnClass += "ring-4 ring-indigo-300 shadow-lg scale-110 z-10 ";
                  }
                  
                  if (isAnswered) {
                    btnClass += isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white";
                  } else {
                    btnClass += "border-2 border-slate-200 text-slate-300 bg-slate-100";
                  }
                } else {
                  if (isCurrent) {
                    btnClass += "bg-indigo-600 ring-2 ring-indigo-200 text-white";
                  } else if (isAnswered) {
                    btnClass += "bg-green-500 text-white hover:bg-green-600";
                  } else {
                    btnClass += "border-2 border-slate-200 text-slate-400 hover:border-indigo-300 hover:text-indigo-500";
                  }
                }

                return (
                  <button 
                    key={q.id}
                    onClick={() => setCurrentQuestionIdx(idx)}
                    className={btnClass}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {isFinished ? (
              <div className="mt-2 p-4 bg-slate-50 rounded-xl flex flex-col gap-2 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full shrink-0"></div>
                  <span className="text-xs text-slate-600 font-medium whitespace-nowrap">إجابة صحيحة</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full shrink-0"></div>
                  <span className="text-xs text-slate-600 font-medium whitespace-nowrap">إجابة خاطئة أو فارغة</span>
                </div>
              </div>
            ) : (
              <div className="mt-2 p-4 bg-slate-50 rounded-xl flex items-center gap-3 shrink-0">
                <div className="w-3 h-3 bg-green-500 rounded-full shrink-0"></div>
                <span className="text-xs text-slate-600 font-medium whitespace-nowrap">مجاب</span>
                <div className="w-3 h-3 bg-indigo-600 rounded-full mr-auto shrink-0"></div>
                <span className="text-xs text-slate-600 font-medium whitespace-nowrap">حالي</span>
              </div>
            )}
          </div>

          <div className="flex-1 glass shadow-card rounded-3xl p-6 flex flex-col gap-4 overflow-hidden relative">
            <h3 className="font-bold text-slate-800 shrink-0">تلميحات / ملاحظات</h3>
            <div className="flex flex-col gap-3 text-sm text-slate-500 leading-relaxed overflow-y-auto">
              <p>• تذكر أن الألكانات هي هيدروكربونات مشبعة.</p>
              <p>• غاز الميثان هو أبسط ألكان ويشكل نسبة كبيرة من الغاز الطبيعي.</p>
              <p>• الرابطة في الألكانات تساهمية أحادية (سيجما).</p>
              <p>• الصيغة العامة للألكانات: C<sub>n</sub>H<sub>2n+2</sub></p>
            </div>
          </div>
        </aside>
      </main>

      {showSummary && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 md:p-12 max-w-lg w-full shadow-2xl flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">اكتمل الاختبار!</h2>
            <p className="text-slate-500 mb-8">لقد أجبت على {Object.keys(answers).length} من أصل {questions.length} أسئلة.</p>
            
            <div className="bg-slate-50 rounded-2xl w-full p-6 mb-8 border border-slate-100">
              <div className="text-sm text-slate-500 font-bold uppercase mb-1">النتيجة النهائية</div>
              <div className="text-5xl font-mono font-bold text-indigo-600">
                {score} <span className="text-2xl text-slate-400">/ {questions.length}</span>
              </div>
            </div>

            <div className="flex gap-4 w-full">
              <button 
                onClick={() => setShowSummary(false)}
                className="flex-1 px-6 py-4 bg-indigo-50 text-indigo-700 rounded-xl font-bold hover:bg-indigo-100 transition-colors cursor-pointer"
              >
                مراجعة الإجابات
              </button>
              <button 
                onClick={handleRestart}
                className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all cursor-pointer"
              >
                إعادة الاختبار
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

