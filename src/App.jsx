import { createSignal, Show, For } from 'solid-js';
import { createEvent } from './supabaseClient';
import { SolidMarkdown } from "solid-markdown";

function App() {
  const [currentPage, setCurrentPage] = createSignal('home');
  const [loading, setLoading] = createSignal(false);
  const [content, setContent] = createSignal('');

  const fetchContent = async (topic) => {
    setLoading(true);
    try {
      const result = await createEvent('chatgpt_request', {
        prompt: `Provide an informative and inspiring explanation about "${topic}" in Islam, in markdown format.`,
        response_type: 'text'
      });
      setContent(result);
      setCurrentPage('content');
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const topics = [
    'Introduction to Islam',
    'Five Pillars of Islam',
    'Beliefs in Islam',
    'Quran and Hadith',
    'Life of Prophet Muhammad (peace be upon him)',
    'Islamic Ethics and Morality'
  ];

  return (
    <div class="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-4 text-gray-800">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-green-600">Discover Islam</h1>
          <p class="mt-4 text-lg">An app to learn about the beauty of Islam</p>
        </div>

        <Show when={currentPage() === 'home'}>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <For each={topics}>
              {(topic) => (
                <button
                  class="bg-white p-6 rounded-lg shadow-md hover:bg-green-50 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer text-left"
                  onClick={() => fetchContent(topic)}
                >
                  <h2 class="text-2xl font-semibold text-green-700">{topic}</h2>
                </button>
              )}
            </For>
          </div>
        </Show>

        <Show when={currentPage() === 'content'}>
          <div>
            <button
              class="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={() => setCurrentPage('home')}
            >
              Back to Topics
            </button>
            <Show when={!loading()} fallback={<p>Loading...</p>}>
              <div class="bg-white p-6 rounded-lg shadow-md">
                <SolidMarkdown children={content()} />
              </div>
            </Show>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default App;