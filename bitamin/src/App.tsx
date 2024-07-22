import React from 'react';
import { useStore } from './store/useStore';
import { useCookies } from 'react-cookie';

const App: React.FC = () => {
  const [cookies, setCookie] = useCookies(['user']);
  const { count, increase, decrease } = useStore();

  const handleLogin = () => {
    setCookie('user', 'username', { path: '/' });
  };

  return (
    <div className="App">
      <h1 className="text-3xl font-bold underline">Hello World</h1>
      <div>
        <p>Count: {count}</p>
        <button onClick={increase}>Increase</button>
        <button onClick={decrease}>Decrease</button>
      </div>
      <div>
        <button onClick={handleLogin}>Set User Cookie</button>
        <p>User Cookie: {cookies.user || 'Not set'}</p>
      </div>
    </div>
  );
};

export default App;
