import { BrowserRouter } from 'react-router-dom';

import Main from './Main';

import './assests/css/App.css';

function App() {
  return (
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  );
}

export default App;
