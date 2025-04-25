import './App.css'
import MusicPlayer from './components/MusicPlayer'


if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/service-worker.js')
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
            });
    });
}

function App() {
  return (
    <div className="bg-zinc-200 overflow-hidden min-h-screen">
      <MusicPlayer />
    </div>
  );
}

export default App
