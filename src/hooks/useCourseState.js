import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook to manage course state and navigation
 */
export function useCourseState(courseData) {
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [currentUnitIndex, setCurrentUnitIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({}); // { unitId: { selectedAnswer, isCorrect, timestamp } }
    const [completedUnits, setCompletedUnits] = useState(new Set());
    const [submittedLessons, setSubmittedLessons] = useState(new Set());

    // Current unit and lesson getters
    const currentLesson = useMemo(() => 
        courseData.lessons[currentLessonIndex], 
        [courseData.lessons, currentLessonIndex]
    );

    const currentUnit = useMemo(() => 
        currentLesson?.units[currentUnitIndex], 
        [currentLesson, currentUnitIndex]
    );

    // Calculate linear position of a unit
    const getLinearPosition = useCallback((lessonIndex, unitIndex) => {
        let pos = 0;
        for (let i = 0; i < lessonIndex; i++) {
            pos += courseData.lessons[i].units.length;
        }
        return pos + unitIndex;
    }, [courseData.lessons]);

    // Check if a unit is accessible
    const isUnitAccessible = useCallback((lessonIndex, unitIndex) => {
        // First unit of first lesson is always accessible
        if (lessonIndex === 0 && unitIndex === 0) return true;

        const targetPosition = getLinearPosition(lessonIndex, unitIndex);

        // Count completed units before this position
        let completedBefore = 0;
        for (let i = 0; i < courseData.lessons.length; i++) {
            for (let j = 0; j < courseData.lessons[i].units.length; j++) {
                const unitId = courseData.lessons[i].units[j].id;
                if (completedUnits.has(unitId)) {
                    const pos = getLinearPosition(i, j);
                    if (pos < targetPosition) completedBefore++;
                }
            }
        }

        return completedBefore >= targetPosition;
    }, [courseData.lessons, completedUnits, getLinearPosition]);

    // Check if a lesson is completed
    const isLessonCompleted = useCallback((lessonIndex) => {
        const lesson = courseData.lessons[lessonIndex];
        return lesson.units.every(u => completedUnits.has(u.id));
    }, [courseData.lessons, completedUnits]);

    // Calculate progress
    const progress = useMemo(() => {
        const totalUnits = courseData.lessons.reduce((sum, lesson) => sum + lesson.units.length, 0);
        const completed = completedUnits.size;
        return Math.round((completed / totalUnits) * 100);
    }, [courseData.lessons, completedUnits]);

    // Navigation state
    const isFirstUnit = currentLessonIndex === 0 && currentUnitIndex === 0;
    const isLastLesson = currentLessonIndex === courseData.lessons.length - 1;
    const isLastUnit = currentUnitIndex === currentLesson?.units.length - 1;
    const hasAnswered = currentUnit ? !!userAnswers[currentUnit.id] : false;

    // Navigation functions
    const navigateToUnit = useCallback((lessonIndex, unitIndex) => {
        if (!isUnitAccessible(lessonIndex, unitIndex)) return;
        setCurrentLessonIndex(lessonIndex);
        setCurrentUnitIndex(unitIndex);
    }, [isUnitAccessible]);

    const goToPrevious = useCallback(() => {
        if (currentUnitIndex > 0) {
            setCurrentUnitIndex(prev => prev - 1);
        } else if (currentLessonIndex > 0) {
            const prevLessonIndex = currentLessonIndex - 1;
            const prevLessonUnits = courseData.lessons[prevLessonIndex].units.length;
            setCurrentLessonIndex(prevLessonIndex);
            setCurrentUnitIndex(prevLessonUnits - 1);
        }
    }, [currentLessonIndex, currentUnitIndex, courseData.lessons]);

    const goToNext = useCallback(() => {
        if (currentUnitIndex < currentLesson.units.length - 1) {
            setCurrentUnitIndex(prev => prev + 1);
        } else if (currentLessonIndex < courseData.lessons.length - 1) {
            setCurrentLessonIndex(prev => prev + 1);
            setCurrentUnitIndex(0);
        }
    }, [currentLessonIndex, currentUnitIndex, currentLesson, courseData.lessons.length]);

    // Answer submission
    const selectAnswer = useCallback((optionId) => {
        if (!currentUnit || userAnswers[currentUnit.id]) return;

        const isCorrect = optionId === currentUnit.correctAnswer;

        setUserAnswers(prev => ({
            ...prev,
            [currentUnit.id]: {
                selectedAnswer: optionId,
                isCorrect,
                timestamp: new Date().toISOString()
            }
        }));

        setCompletedUnits(prev => new Set([...prev, currentUnit.id]));
    }, [currentUnit, userAnswers]);

    // Build lesson result for postMessage
    const buildLessonResult = useCallback((lessonIndex) => {
        const lesson = courseData.lessons[lessonIndex];
        
        const unitResults = lesson.units.map(unit => ({
            unitId: unit.id,
            isCorrect: userAnswers[unit.id]?.isCorrect || false
        }));

        const correctCount = unitResults.filter(u => u.isCorrect).length;
        const isPassed = correctCount >= Math.ceil(lesson.units.length * 0.6);

        return {
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            unitResults,
            isPassed
        };
    }, [courseData.lessons, userAnswers]);

    // Submit lesson via postMessage
    const submitLesson = useCallback((lessonIndex) => {
        const lesson = courseData.lessons[lessonIndex];
        
        if (submittedLessons.has(lesson.id)) return;

        const lessonResult = buildLessonResult(lessonIndex);
        const signature = new URLSearchParams(window.location.search).get('signature');

        const message = {
            type: 'SUBMIT_LESSON',
            payload: {
                ...lessonResult,
                ...(signature && { signature })
            }
        };

        if (signature) {
            window.parent.postMessage(message, '*');

            const event = new CustomEvent('lessonSubmitted', { detail: message.payload });
            window.dispatchEvent(event);

            setSubmittedLessons(prev => new Set([...prev, lesson.id]));
            console.log('Lesson submitted via postMessage:', message);
        } else {
            console.log('Lesson data (no signature, not sent):', message);
        }
    }, [courseData.lessons, submittedLessons, buildLessonResult]);

    return {
        // State
        courseData,
        currentLessonIndex,
        currentUnitIndex,
        currentLesson,
        currentUnit,
        userAnswers,
        completedUnits,
        progress,
        
        // Navigation state
        isFirstUnit,
        isLastLesson,
        isLastUnit,
        hasAnswered,

        // Functions
        isUnitAccessible,
        isLessonCompleted,
        navigateToUnit,
        goToPrevious,
        goToNext,
        selectAnswer,
        submitLesson
    };
}
