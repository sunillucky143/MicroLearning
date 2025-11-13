import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { topicsApi } from '../api/topics';
import { notesApi } from '../api/notes';
import { learningApi } from '../api/learning';
import {
  ArrowLeft, BookOpen, MessageSquare, Gamepad2, Headphones,
  Mic, Video, BookImage, Sparkles, Save, Send
} from 'lucide-react';
import type { Topic, Note, ChatMessage } from '../types';

export default function Learn() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();

  const [topic, setTopic] = useState<Topic | null>(null);
  const [note, setNote] = useState<Note | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [activeMode, setActiveMode] = useState<'content' | 'chat'>('content');
  const [modeLoading, setModeLoading] = useState<string | null>(null);

  useEffect(() => {
    if (topicId) {
      loadTopic();
      loadNote();
    }
  }, [topicId]);

  const loadTopic = async () => {
    try {
      const data = await topicsApi.getById(topicId!);
      setTopic(data);
    } catch (err) {
      console.error('Failed to load topic:', err);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loadNote = async () => {
    try {
      const data = await notesApi.getByTopic(topicId!);
      if (data) {
        setNote(data);
        setNoteContent(data.content);
      }
    } catch (err) {
      console.error('Failed to load note:', err);
    }
  };

  const handleSaveNote = async () => {
    if (!noteContent.trim()) return;

    setSavingNote(true);
    try {
      if (note) {
        const updated = await notesApi.update(note.id, noteContent);
        setNote(updated);
      } else {
        const created = await notesApi.create(topicId!, noteContent);
        setNote(created);
      }
    } catch (err) {
      console.error('Failed to save note:', err);
      alert('Failed to save note');
    } finally {
      setSavingNote(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || chatLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, userMessage]);
    setInputMessage('');
    setChatLoading(true);

    try {
      const response = await learningApi.chat(topicId!, [...messages, userMessage]);
      setMessages((prev) => [...prev, response]);
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Failed to get response');
    } finally {
      setChatLoading(false);
    }
  };

  const handleGameMode = async () => {
    setModeLoading('game');
    try {
      const { gameUrl } = await learningApi.generateGame(topicId!);
      window.open(gameUrl, '_blank');
    } catch (err) {
      console.error('Failed to generate game:', err);
      alert('Failed to generate game. This feature requires backend setup.');
    } finally {
      setModeLoading(null);
    }
  };

  const handleAudioMode = async () => {
    setModeLoading('audio');
    try {
      const { audioUrl } = await learningApi.convertToAudio(topicId!);
      window.open(audioUrl, '_blank');
    } catch (err) {
      console.error('Failed to generate audio:', err);
      alert('Failed to generate audio. This feature requires backend setup.');
    } finally {
      setModeLoading(null);
    }
  };

  const handlePodcastMode = async () => {
    setModeLoading('podcast');
    try {
      const { audioUrl } = await learningApi.convertToPodcast(topicId!);
      window.open(audioUrl, '_blank');
    } catch (err) {
      console.error('Failed to generate podcast:', err);
      alert('Failed to generate podcast. This feature requires backend setup.');
    } finally {
      setModeLoading(null);
    }
  };

  const handleVideoMode = async () => {
    setModeLoading('video');
    try {
      const { videoUrl } = await learningApi.convertToVideo(topicId!);
      window.open(videoUrl, '_blank');
    } catch (err) {
      console.error('Failed to generate video:', err);
      alert('Failed to generate video. This feature requires backend setup.');
    } finally {
      setModeLoading(null);
    }
  };

  const handleComicMode = async () => {
    setModeLoading('comic');
    try {
      const { comicUrl } = await learningApi.convertToComic(topicId!);
      window.open(comicUrl, '_blank');
    } catch (err) {
      console.error('Failed to generate comic:', err);
      alert('Failed to generate comic. This feature requires backend setup.');
    } finally {
      setModeLoading(null);
    }
  };

  const handleCustomMode = async () => {
    const description = prompt('Describe the custom interactive feature you want:');
    if (!description) return;

    setModeLoading('custom');
    try {
      const { content } = await learningApi.customBuilder(topicId!, description);
      alert('Custom feature generated! Check console for content.');
      console.log('Custom content:', content);
    } catch (err) {
      console.error('Failed to generate custom feature:', err);
      alert('Failed to generate custom feature. This feature requires backend setup.');
    } finally {
      setModeLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading topic...</p>
        </div>
      </div>
    );
  }

  if (!topic) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{topic.title}</h1>
              <p className="text-gray-600">{topic.description}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Mode Selector */}
          <div className="bg-white border-b px-4 py-3">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveMode('content')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeMode === 'content'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <BookOpen className="w-4 h-4 inline mr-2" />
                Content
              </button>
              <button
                onClick={() => setActiveMode('chat')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeMode === 'chat'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <MessageSquare className="w-4 h-4 inline mr-2" />
                AI Chat
              </button>
            </div>
          </div>

          {/* Content Display */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeMode === 'content' ? (
              <div className="max-w-3xl mx-auto">
                <div className="card prose max-w-none">
                  <div className="whitespace-pre-wrap">{topic.content}</div>
                </div>

                {/* Learning Mode Buttons */}
                <div className="mt-6 card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Interactive Learning Modes
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button
                      onClick={handleGameMode}
                      disabled={!!modeLoading}
                      className="btn-secondary flex flex-col items-center p-4"
                    >
                      <Gamepad2 className="w-6 h-6 mb-2" />
                      <span className="text-sm">2D Game</span>
                    </button>
                    <button
                      onClick={handleAudioMode}
                      disabled={!!modeLoading}
                      className="btn-secondary flex flex-col items-center p-4"
                    >
                      <Headphones className="w-6 h-6 mb-2" />
                      <span className="text-sm">Audio Book</span>
                    </button>
                    <button
                      onClick={handlePodcastMode}
                      disabled={!!modeLoading}
                      className="btn-secondary flex flex-col items-center p-4"
                    >
                      <Mic className="w-6 h-6 mb-2" />
                      <span className="text-sm">Podcast</span>
                    </button>
                    <button
                      onClick={handleVideoMode}
                      disabled={!!modeLoading}
                      className="btn-secondary flex flex-col items-center p-4"
                    >
                      <Video className="w-6 h-6 mb-2" />
                      <span className="text-sm">Video</span>
                    </button>
                    <button
                      onClick={handleComicMode}
                      disabled={!!modeLoading}
                      className="btn-secondary flex flex-col items-center p-4"
                    >
                      <BookImage className="w-6 h-6 mb-2" />
                      <span className="text-sm">Comic</span>
                    </button>
                    <button
                      onClick={handleCustomMode}
                      disabled={!!modeLoading}
                      className="btn-secondary flex flex-col items-center p-4"
                    >
                      <Sparkles className="w-6 h-6 mb-2" />
                      <span className="text-sm">Custom</span>
                    </button>
                  </div>
                  {modeLoading && (
                    <p className="text-center text-gray-600 mt-4">
                      Generating {modeLoading} mode...
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto h-full flex flex-col">
                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        Start a conversation about this topic with AI!
                      </p>
                    </div>
                  ) : (
                    messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${
                          msg.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            msg.role === 'user'
                              ? 'bg-primary-600 text-white'
                              : 'bg-white border border-gray-200'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                        <p className="text-gray-600">AI is typing...</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask anything about this topic..."
                    className="input-field flex-1"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={chatLoading || !inputMessage.trim()}
                    className="btn-primary"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notes Panel */}
        <div className="w-96 bg-white border-l flex flex-col">
          <div className="px-4 py-3 border-b">
            <h3 className="font-semibold text-gray-900">Notes</h3>
          </div>
          <div className="flex-1 p-4">
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Take notes about this topic..."
              className="w-full h-full resize-none border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="px-4 py-3 border-t">
            <button
              onClick={handleSaveNote}
              disabled={savingNote || !noteContent.trim()}
              className="btn-primary w-full"
            >
              <Save className="w-4 h-4 inline mr-2" />
              {savingNote ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
