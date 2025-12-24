/**
 * Mock Course Data
 * 3 Lessons, each with 3 Units (quiz questions)
 * Structure aligned with LessonPostMessage types
 */

export const courseData = {
    id: "course-001",
    title: "Introduction to Web Development",
    description: "Learn the fundamentals of modern web development",
    lessons: [
        {
            id: "lesson-1",
            title: "HTML Fundamentals",
            description: "Learn the building blocks of the web",
            units: [
                {
                    id: "unit-1-1",
                    question: "What does HTML stand for?",
                    options: [
                        { id: "a", text: "Hyper Text Markup Language" },
                        { id: "b", text: "High Tech Modern Language" },
                        { id: "c", text: "Home Tool Markup Language" },
                        { id: "d", text: "Hyperlinks and Text Markup Language" }
                    ],
                    correctAnswer: "a",
                    explanation: "HTML stands for Hyper Text Markup Language. It's the standard markup language for creating web pages."
                },
                {
                    id: "unit-1-2",
                    question: "Which HTML element is used for the largest heading?",
                    options: [
                        { id: "a", text: "<heading>" },
                        { id: "b", text: "<h6>" },
                        { id: "c", text: "<h1>" },
                        { id: "d", text: "<head>" }
                    ],
                    correctAnswer: "c",
                    explanation: "The <h1> element defines the most important heading. Headings range from <h1> (largest) to <h6> (smallest)."
                },
                {
                    id: "unit-1-3",
                    question: "Which attribute is used to provide an alternate text for an image?",
                    options: [
                        { id: "a", text: "title" },
                        { id: "b", text: "src" },
                        { id: "c", text: "alt" },
                        { id: "d", text: "description" }
                    ],
                    correctAnswer: "c",
                    explanation: "The 'alt' attribute provides alternative text for an image if it cannot be displayed."
                }
            ]
        },
        {
            id: "lesson-2",
            title: "CSS Styling",
            description: "Make your websites beautiful with CSS",
            units: [
                {
                    id: "unit-2-1",
                    question: "What does CSS stand for?",
                    options: [
                        { id: "a", text: "Creative Style Sheets" },
                        { id: "b", text: "Cascading Style Sheets" },
                        { id: "c", text: "Computer Style Sheets" },
                        { id: "d", text: "Colorful Style Sheets" }
                    ],
                    correctAnswer: "b",
                    explanation: "CSS stands for Cascading Style Sheets. It describes how HTML elements should be displayed."
                },
                {
                    id: "unit-2-2",
                    question: "Which CSS property is used to change the text color?",
                    options: [
                        { id: "a", text: "font-color" },
                        { id: "b", text: "text-color" },
                        { id: "c", text: "color" },
                        { id: "d", text: "fgcolor" }
                    ],
                    correctAnswer: "c",
                    explanation: "The 'color' property is used to set the color of text content in CSS."
                },
                {
                    id: "unit-2-3",
                    question: "Which CSS property controls the spacing between elements?",
                    options: [
                        { id: "a", text: "spacing" },
                        { id: "b", text: "margin" },
                        { id: "c", text: "padding-outside" },
                        { id: "d", text: "border-spacing" }
                    ],
                    correctAnswer: "b",
                    explanation: "The 'margin' property controls the space outside an element's border."
                }
            ]
        },
        {
            id: "lesson-3",
            title: "JavaScript Basics",
            description: "Add interactivity to your websites",
            units: [
                {
                    id: "unit-3-1",
                    question: "Which keyword is used to declare a constant in JavaScript?",
                    options: [
                        { id: "a", text: "var" },
                        { id: "b", text: "let" },
                        { id: "c", text: "const" },
                        { id: "d", text: "constant" }
                    ],
                    correctAnswer: "c",
                    explanation: "The 'const' keyword declares a constant variable that cannot be reassigned."
                },
                {
                    id: "unit-3-2",
                    question: "What is the correct way to write a JavaScript array?",
                    options: [
                        { id: "a", text: "var colors = (1:'red', 2:'green', 3:'blue')" },
                        { id: "b", text: "var colors = ['red', 'green', 'blue']" },
                        { id: "c", text: "var colors = 'red', 'green', 'blue'" },
                        { id: "d", text: "var colors = {red, green, blue}" }
                    ],
                    correctAnswer: "b",
                    explanation: "JavaScript arrays are written with square brackets, with items separated by commas."
                },
                {
                    id: "unit-3-3",
                    question: "Which method is used to add an element to the end of an array?",
                    options: [
                        { id: "a", text: "push()" },
                        { id: "b", text: "append()" },
                        { id: "c", text: "add()" },
                        { id: "d", text: "insert()" }
                    ],
                    correctAnswer: "a",
                    explanation: "The push() method adds new items to the end of an array and returns the new length."
                }
            ]
        }
    ]
};
