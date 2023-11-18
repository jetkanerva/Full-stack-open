import React from 'react';
import "./App.css"

// Note I would not write this verbose code in production but for testing it is fine!

const Course = ({ course }) => {
    console.log("Course")
    console.log(course)

    const Header = ({ course }) => {
        console.log("Header")
        console.log(course)
        return (
            <div>
                <h1>{course}</h1>
            </div>
        )
    }

    const Part = ({ part, exercises }) => {
        console.log("Part")
        console.log(part)
        console.log(exercises)
        return (
            <div>
                <p> {part} {exercises} </p>
            </div>
        )
    }

    const Content = ({ parts }) => {
        console.log("Content")
        console.log(parts)
        return (
            <div>
                {parts.map(part =>
                    <Part key={part.id} part={part.name} exercises={part.exercises}/>
                )}
            </div>
        )
    }

    const Total = ({ parts }) => {
        console.log("Total")
        console.log(parts)
        const totalExercises = parts.reduce((sum, part) => sum + part.exercises, 0);
        return (
            <div>
                <p>total of {totalExercises} exercises</p>
            </div>
        )
    }

        return (
            <div>
                <Header course={course.name} />
                <Content parts={course.parts} />
                <Total parts={course.parts} />
            </div>
        )
}

const App = () => {
    const courses = [
        {
            name: 'Half Stack application development',
            id: 1,
            parts: [
                {
                    name: 'Fundamentals of React',
                    exercises: 10,
                    id: 1
                },
                {
                    name: 'Using props to pass data',
                    exercises: 7,
                    id: 2
                },
                {
                    name: 'State of a component',
                    exercises: 14,
                    id: 3
                },
                {
                    name: 'Redux',
                    exercises: 11,
                    id: 4
                }
            ]
        },
        {
            name: 'Node.js',
            id: 2,
            parts: [
                {
                    name: 'Routing',
                    exercises: 3,
                    id: 1
                },
                {
                    name: 'Middlewares',
                    exercises: 7,
                    id: 2
                }
            ]
        }
    ]

    return (
        <div>
            {courses.map(course =>
                <Course key={course.id} course={course} />
            )}
        </div>
    )
}

export default App;
