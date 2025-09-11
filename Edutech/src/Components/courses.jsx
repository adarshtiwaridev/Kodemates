import React from 'react';

const Courses = () => {
  const dummyCourses = [
    { id: 1, title: 'React for Beginners', instructor: 'John Doe', price: '$49' },
    { id: 2, title: 'Advanced JavaScript', instructor: 'Jane Smith', price: '$59' },
    { id: 3, title: 'Python Data Science', instructor: 'Alice Johnson', price: '$79' },
    { id: 4, title: 'Fullstack Web Development', instructor: 'Bob Brown', price: '$99' },
    { id: 5, title: 'Machine Learning Basics', instructor: 'Charlie Lee', price: '$89' },
    { id: 6, title: 'CSS Flexbox & Grid', instructor: 'Diana Adams', price: '$39' },
    { id: 7, title: 'Node.js Fundamentals', instructor: 'Evan Green', price: '$69' },
    { id: 8, title: 'Angular Crash Course', instructor: 'Fiona White', price: '$55' },
    { id: 9, title: 'Vue.js Essentials', instructor: 'George Black', price: '$49' },
    { id: 10, title: 'Database Design Basics', instructor: 'Hannah Blue', price: '$45' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-center mb-8">Available Courses</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {dummyCourses.map((course) => (
          <div key={course.id} className="border rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow duration-300 bg-white">
            <h2 className="text-2xl font-semibold mb-3">{course.title}</h2>
            <p className="text-gray-700 mb-2">Instructor: {course.instructor}</p>
            <p className="text-blue-600 text-lg font-medium">{course.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
