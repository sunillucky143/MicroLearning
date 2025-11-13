import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { coursesApi } from '../api/courses';
import { useCourseStore } from '../store/courseStore';
import { BookOpen, Target, Calendar } from 'lucide-react';

export default function CourseSetup() {
  const navigate = useNavigate();
  const setActiveCourse = useCourseStore((state) => state.setActiveCourse);
  const [courseName, setCourseName] = useState('');
  const [focusArea, setFocusArea] = useState('');
  const [topicsPerDay, setTopicsPerDay] = useState(3);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const course = await coursesApi.create({
        courseName,
        focusArea,
        topicsPerDay,
      });
      setActiveCourse(course);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <BookOpen className="w-16 h-16 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Set Up Your Learning Path</h1>
          <p className="text-gray-600">Tell us what you want to learn and we'll create a personalized plan</p>
        </div>

        <div className="card">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="courseName" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="w-4 h-4 mr-2" />
                Course Name
              </label>
              <input
                id="courseName"
                type="text"
                required
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="input-field"
                placeholder="e.g., Web Development, Machine Learning, Spanish"
              />
              <p className="text-sm text-gray-500 mt-1">What do you want to learn?</p>
            </div>

            <div>
              <label htmlFor="focusArea" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Target className="w-4 h-4 mr-2" />
                Focus Area / Description
              </label>
              <textarea
                id="focusArea"
                required
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
                className="input-field min-h-[120px]"
                placeholder="Describe what specific areas you want to focus on, your current level, and any specific goals..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Be specific! This helps our AI create better micro-topics for you.
              </p>
            </div>

            <div>
              <label htmlFor="topicsPerDay" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                Topics Per Day
              </label>
              <div className="flex items-center space-x-4">
                <input
                  id="topicsPerDay"
                  type="range"
                  min="1"
                  max="10"
                  value={topicsPerDay}
                  onChange={(e) => setTopicsPerDay(Number(e.target.value))}
                  className="flex-1"
                />
                <div className="bg-primary-100 text-primary-700 px-4 py-2 rounded-lg font-semibold min-w-[60px] text-center">
                  {topicsPerDay}
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                How many micro-topics can you learn per day? (Recommended: 3-5)
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• AI will generate personalized micro-topics based on your input</li>
                <li>• You'll get {topicsPerDay} topic{topicsPerDay > 1 ? 's' : ''} to learn each day</li>
                <li>• Learn through interactive modes: chat, games, videos, and more!</li>
                <li>• Track your progress with our smart to-do calendar</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Creating Your Learning Path...' : 'Start Learning Journey'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
