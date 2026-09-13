import { ChatBot } from './components/ChatBot';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center">
      <div className="w-full max-w-md h-screen sm:h-[700px] bg-white flex flex-col shadow-2xl sm:rounded-2xl overflow-hidden relative">
        <ChatBot />
      </div>
    </div>
  );
}

export default App;
