/* @jsx Ryact */
import Ryact, { render, useState, useEffect } from './ryact.js';

const Test = () => <h1>Test</h1>;

const Component = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const handler = () => setCount(currentCount => currentCount + 1);
    buttonElem.addEventListener('click', handler);
    return () => buttonElem.removeEventListener('click', handler);
  }, [buttonElem]);

  return <div>
    <h1>
      Test Heading
    </h1>
    <p>
      Test paragraph
    </p>
    <button>Click me</button>
    <Test />
  </div>;
}

render(Component, document.getElementById('root'), { });

