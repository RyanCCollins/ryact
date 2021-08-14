/* @jsx Ryact */
import Ryact, { render, useState, useEffect } from './ryact.js';

const Heading = ({ children }) => {
  return <h1>{children}</h1>;
};

const Paragraph = ({ children }) => {
  return <p>{children}</p>;
};

const Component = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const handler = () => setCount(currentCount => currentCount + 1);
    buttonElem.addEventListener('click', handler);
    return () => buttonElem.removeEventListener('click', handler);
  }, []);

  return <div>
    <Heading>
      Test
    </Heading>
    <Paragraph>
      Test paragraph
    </Paragraph>
    <button>Click me</button>
  </div>;
}

render(Component, document.getElementById('root'), { });

