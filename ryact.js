let globalId = 0;
let globalParent;
const componentState = new Map();

export function useState(initialState) {
  const id = globalId;
  const parent = globalParent;
  globalId++

  const { cache } = componentState.get(parent);
  if (cache[id] == null) {
    cache[id] = {
      value: typeof initialState === 'function' ? initialState() : initialState
    };
  }

  const setState = state => {
    const { props, component } = componentState.get(parent);
    if (typeof state === 'function') {
      cache[id].value = state(cache[id].value);
    } else {
      cache[id].value = state;
    }
    render(component, props, parent);
  }
  
  return [cache[id].value, setState];
}

export function useEffect(callback, dependencies) {
  const id = globalId;
  const parent = globalParent;
  globalId++

  const { cache } = componentState.get(parent);
  if (cache[id] == null) {
    cache[id] = {
      dependencies: undefined
    };
  }

  const dependenciesChanged = dependencies == null || dependencies.some((dep, i) => {
    return cache[id].dependencies == null || cache[id].dependencies[i] !== dep;
  });

  if (dependenciesChanged) {
    if(cache[id].cleanup != null) {
      cache[id].cleanup();
    }
    cache[id].cleanup = callback();
    cache[id].dependencies = dependencies;
  }
}

export function createElement(node) {
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }
  let $el
  if (typeof node.type === 'function') {
    console.log(node)
    $el = createElement(node.type({ ...node }));
  } else {
    $el = document.createElement(node.type);
  }
  (node.children || [])
    .map(createElement)
    .forEach($el.appendChild.bind($el));
  return $el;
}

export function render(component, parent, props) {
  const state = componentState.get(parent) || { cache: [] };
  componentState.set(parent, { ...state, component, props });
  globalParent = parent;
  const output = component(props);
  globalId = 0;
  parent.appendChild(createElement(output));
}

export default function Ryact(type, props, ...children) {
  return { type, props, children };
}
