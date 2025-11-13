import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourseStore } from '../store/courseStore';
import { useAuthStore } from '../store/authStore';
import { coursesApi } from '../api/courses';
import { topicsApi } from '../api/topics';
import { ChevronLeft, ChevronRight, Calendar, BookOpen, CheckCircle, Circle, LogOut } from 'lucide-react';
import { formatDate, formatDisplayDate, isToday, canAccessDate, getNextDay, getPreviousDay, isDateInFuture } from '../utils/date';
import type { Topic } from '../types';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { activeCourse, setActiveCourse, selectedDate, setSelectedDate } = useCourseStore();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadActiveCourse();
  }, []);

  useEffect(() => {
    if (activeCourse) {
      loadTopics();
    }
  }, [selectedDate, activeCourse]);

  const loadActiveCourse = async () => {
    try {
      const course = await coursesApi.getActive();
      if (!course) {
        navigate('/setup');
        return;
      }
      setActiveCourse(course);
    } catch (err) {
      console.error('Failed to load course:', err);
      navigate('/setup');
    }
  };

  const loadTopics = async () => {
    setLoading(true);
    setError('');
    try {
      const dateStr = formatDate(selectedDate);
      const data = await topicsApi.getByDate(dateStr);
      setTopics(data);
    } catch (err: any) {
      setError('Failed to load topics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousDay = () => {
    setSelectedDate(getPreviousDay(selectedDate));
  };

  const handleNextDay = () => {
    const nextDay = getNextDay(selectedDate);
    if (!isDateInFuture(nextDay)) {
      setSelectedDate(nextDay);
    }
  };

  const handleDateJump = () => {
    const input = prompt('Enter date (YYYY-MM-DD):');
    if (input) {
      try {
        const newDate = new Date(input);
        if (!isNaN(newDate.getTime()) && canAccessDate(newDate)) {
          setSelectedDate(newDate);
        } else {
          alert('Invalid date or future date selected. You can only access present and past dates.');
        }
      } catch (err) {
        alert('Invalid date format');
      }
    }
  };

  const handleTopicClick = (topic: Topic) => {
    navigate(`/learn/${topic.id}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const canGoNext = !isDateInFuture(getNextDay(selectedDate));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-8 h-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">MicroLearning</h1>
              {activeCourse && (
                <p className="text-sm text-gray-600">{activeCourse.courseName}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-600">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Date Navigation */}
        <div className="card mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePreviousDay}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Previous day"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-4">
              <Calendar className="w-6 h-6 text-primary-600" />
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {formatDisplayDate(selectedDate)}
                </h2>
                {isToday(selectedDate) && (
                  <span className="inline-block bg-primary-100 text-primary-700 text-xs font-semibold px-2 py-1 rounded-full mt-1">
                    Today
                  </span>
                )}
              </div>
              <button
                onClick={handleDateJump}
                className="btn-secondary text-sm"
              >
                Jump to Date
              </button>
            </div>

            <button
              onClick={handleNextDay}
              disabled={!canGoNext}
              className={`p-2 rounded-lg transition-colors ${
                canGoNext
                  ? 'hover:bg-gray-100'
                  : 'opacity-50 cursor-not-allowed'
              }`}
              title={canGoNext ? 'Next day' : 'Cannot access future dates'}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Topics List */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Today's Learning Topics
          </h3>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading topics...</p>
            </div>
          ) : error ? (
            <div className="card bg-red-50 border border-red-200">
              <p className="text-red-700">{error}</p>
            </div>
          ) : topics.length === 0 ? (
            <div className="card text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No topics scheduled for this day</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => handleTopicClick(topic)}
                  disabled={isDateInFuture(selectedDate)}
                  className={`card text-left hover:shadow-lg transition-shadow ${
                    isDateInFuture(selectedDate)
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:border-primary-300 cursor-pointer'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 pt-1">
                      {topic.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        {topic.title}
                      </h4>
                      <p className="text-gray-600 line-clamp-2">
                        {topic.description}
                      </p>
                      {topic.completed && topic.completedAt && (
                        <p className="text-sm text-green-600 mt-2">
                          Completed on {formatDisplayDate(topic.completedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {isDateInFuture(selectedDate) && topics.length > 0 && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                Topics for future dates are locked. You can only learn topics from today or past dates.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
