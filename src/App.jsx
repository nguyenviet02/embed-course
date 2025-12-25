import { useState, useEffect } from "react";
import { courseData } from "./data/courseData";
import { useCourseState } from "./hooks/useCourseState";
import { Sidebar } from "./components/Sidebar";
import { QuizContent } from "./components/QuizContent";
import { SuccessModal } from "./components/SuccessModal";
import "./App.css";
import { useSearchParams } from "react-router-dom";
import useSignatureAuth from "./hooks/useSignatureAuth";

function App() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const {
    currentLessonIndex,
    currentUnitIndex,
    currentLesson,
    currentUnit,
    userAnswers,
    completedUnits,
    progress,
    isFirstUnit,
    isLastLesson,
    isLastUnit,
    hasAnswered,
    isUnitAccessible,
    isLessonCompleted,
    navigateToUnit,
    goToPrevious,
    goToNext,
    selectAnswer,
    submitLesson,
  } = useCourseState(courseData);

  const [searchParams] = useSearchParams();
  const signature = searchParams.get("signature");

  const {
    submitLesson: submitLessonToParent,
    submitCourse: submitCourseToParent,
  } = useSignatureAuth({
    signature,
  });

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" && !isFirstUnit) {
        goToPrevious();
      } else if (e.key === "ArrowRight" && hasAnswered) {
        handleNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFirstUnit, hasAnswered, goToPrevious]);

  const handleNext = () => {
    if (!hasAnswered) {
      // Trigger shake animation
      if (window.shakeQuizOptions) {
        window.shakeQuizOptions();
      }
      return;
    }

    // If this is the last unit of the lesson, submit the lesson
    if (isLastUnit) {
      submitLessonToParent();
      submitLesson(currentLessonIndex);
    }

    // Check if this is the last unit of the last lesson
    if (isLastLesson && isLastUnit) {
      submitCourseToParent();
      setShowSuccessModal(true);

      return;
    }

    goToNext();
  };

  const getNextButtonText = () => {
    if (isLastLesson && isLastUnit) {
      return (
        <>
          Complete <span className="btn-icon">✓</span>
        </>
      );
    } else if (isLastUnit) {
      return (
        <>
          Next Lesson <span className="btn-icon">→</span>
        </>
      );
    }
    return (
      <>
        Next <span className="btn-icon">→</span>
      </>
    );
  };

  return (
    <div className="app-container">
      <Sidebar
        courseData={courseData}
        currentLessonIndex={currentLessonIndex}
        currentUnitIndex={currentUnitIndex}
        completedUnits={completedUnits}
        progress={progress}
        isUnitAccessible={isUnitAccessible}
        isLessonCompleted={isLessonCompleted}
        onNavigate={navigateToUnit}
      />

      <main className="main-content">
        <header className="content-header">
          <div className="breadcrumb">
            <span>{courseData.title}</span>
            <span className="breadcrumb-separator">›</span>
            <span>{currentLesson?.title}</span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">
              Unit {currentUnitIndex + 1}
            </span>
          </div>
        </header>

        <div className="quiz-container">
          <QuizContent
            courseData={courseData}
            currentLesson={currentLesson}
            currentUnit={currentUnit}
            currentUnitIndex={currentUnitIndex}
            userAnswers={userAnswers}
            onSelectAnswer={selectAnswer}
          />
        </div>

        <footer className="content-footer">
          <button
            className="btn btn-secondary"
            onClick={goToPrevious}
            disabled={isFirstUnit}
          >
            <span className="btn-icon">←</span>
            Previous
          </button>
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!hasAnswered}
          >
            {getNextButtonText()}
          </button>
        </footer>
      </main>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
}

export default App;
