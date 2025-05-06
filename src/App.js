import './App.css';
import Weather from './components/Weather';

function App() {
  return (
    <div className="App">
      <h1 className='title'>간단한 날씨 앱</h1>
      <div className='contents'>
        <Weather />
      </div>
    </div>
  );
}

export default App;
