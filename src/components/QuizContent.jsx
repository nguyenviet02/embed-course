import { useRef, useEffect } from 'react';
import './QuizContent.css';

export function QuizContent({
    courseData,
    currentLesson,
    currentUnit,
    currentUnitIndex,
    userAnswers,
    onSelectAnswer
}) {
    const optionsRef = useRef([]);

    const userAnswer = currentUnit ? userAnswers[currentUnit.id] : null;

    const handleOptionClick = (optionId) => {
        if (userAnswer) return;
        onSelectAnswer(optionId);
    };

    const shakeOptions = () => {
        optionsRef.current.forEach(opt => {
            if (opt) {
                opt.style.animation = 'shake 0.5s ease';
                setTimeout(() => {
                    opt.style.animation = '';
                }, 500);
            }
        });
    };

    // Expose shake function to parent
    useEffect(() => {
        window.shakeQuizOptions = shakeOptions;
        return () => {
            delete window.shakeQuizOptions;
        };
    }, []);

    if (!currentUnit || !currentLesson) return null;

    return (
        <div className="quiz-content">
            <div className="quiz-header">
                <span className="quiz-label">
                    Question {currentUnitIndex + 1} of {currentLesson.units.length}
                </span>
                <h1 className="quiz-question">{currentUnit.question}</h1>
            </div>

            <div className="quiz-options">
                {currentUnit.options.map((option, index) => {
                    let optionClass = '';
                    if (userAnswer) {
                        if (option.id === currentUnit.correctAnswer) {
                            optionClass = 'correct disabled';
                        } else if (option.id === userAnswer.selectedAnswer) {
                            optionClass = 'incorrect disabled';
                        } else {
                            optionClass = 'disabled';
                        }
                    }

                    return (
                        <div
                            key={option.id}
                            ref={el => optionsRef.current[index] = el}
                            className={`option-item ${optionClass}`}
                            onClick={() => handleOptionClick(option.id)}
                        >
                            <span className="option-marker">{option.id.toUpperCase()}</span>
                            <span className="option-text">{option.text}</span>
                        </div>
                    );
                })}
            </div>

            {userAnswer && (
                <div className={`quiz-feedback ${userAnswer.isCorrect ? 'correct' : 'incorrect'} show`}>
                    <div className="feedback-title">
                        {userAnswer.isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                    </div>
                    <div className="feedback-text">{currentUnit.explanation}</div>
                </div>
            )}
        </div>
    );
}
