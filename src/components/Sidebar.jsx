import './Sidebar.css';

export function Sidebar({ 
    courseData, 
    currentLessonIndex, 
    currentUnitIndex, 
    completedUnits,
    progress,
    isUnitAccessible,
    isLessonCompleted,
    onNavigate 
}) {
    const handleLessonClick = (lessonIndex) => {
        const quizList = document.getElementById(`quiz-list-${lessonIndex}`);
        if (quizList) {
            quizList.classList.toggle('expanded');
        }
    };

    const handleUnitClick = (lessonIndex, unitIndex) => {
        if (!isUnitAccessible(lessonIndex, unitIndex)) return;
        onNavigate(lessonIndex, unitIndex);
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo">
                    <span className="logo-icon">◈</span>
                    <span className="logo-text">EasyCourse</span>
                </div>
            </div>

            <nav className="lesson-nav">
                {courseData.lessons.map((lesson, lessonIndex) => {
                    const isActive = lessonIndex === currentLessonIndex;
                    const lessonCompleted = isLessonCompleted(lessonIndex);

                    return (
                        <div className="lesson-item" key={lesson.id}>
                            <button 
                                className={`lesson-header ${isActive ? 'active' : ''} ${lessonCompleted ? 'completed' : ''}`}
                                onClick={() => handleLessonClick(lessonIndex)}
                            >
                                <span className="lesson-number">
                                    {lessonCompleted ? '✓' : lessonIndex + 1}
                                </span>
                                <span className="lesson-title">{lesson.title}</span>
                            </button>

                            <div 
                                id={`quiz-list-${lessonIndex}`}
                                className={`quiz-list ${isActive ? 'expanded' : ''}`}
                            >
                                {lesson.units.map((unit, unitIndex) => {
                                    const isUnitActive = isActive && unitIndex === currentUnitIndex;
                                    const isCompleted = completedUnits.has(unit.id);
                                    const isAccessible = isUnitAccessible(lessonIndex, unitIndex);

                                    let statusClass = '';
                                    if (isUnitActive) statusClass = 'active';
                                    else if (isCompleted) statusClass = 'completed';
                                    else if (!isAccessible) statusClass = 'locked';

                                    return (
                                        <div 
                                            key={unit.id}
                                            className={`quiz-item ${statusClass}`}
                                            onClick={() => handleUnitClick(lessonIndex, unitIndex)}
                                        >
                                            <span className="quiz-status"></span>
                                            <span>Unit {unitIndex + 1}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                <div className="progress-info">
                    <span className="progress-label">Course Progress</span>
                    <div className="progress-bar">
                        <div 
                            className="progress-fill" 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <span className="progress-text">{progress}% Complete</span>
                </div>
            </div>
        </aside>
    );
}
