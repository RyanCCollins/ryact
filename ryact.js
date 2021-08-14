let globalId = 0;
let globalParent;
const componentState = new Map();

export default function Ryact(type, props, ...children) {
  return { type, props, children };
}

export function useState(initialState) {
  const id = globalId;
  const parent = globalParent;
  globalId++

  const { cache } = componentState.get(globalParent);
  if (cache[id] == null) {
    cache[id] = {
      value: typeof initialState === 'function' ? initialState() : initialState
    };
  }

  const setState = state => {
    const { props, component } = componentState.get(globalParent);
    if (typeof state === 'function') {
      cache[id].value = state(cache[id].value);
    } else {
      cache[id].value = state;
    }
    render(component, props, parent);
  }
  
  return [cache[id].value, setState];
}

export function createElement(node) {
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }
  let $el
  console.log(`Node: ${node}`)
  if (node.type === 'function') {
    console.log(node.type())
    $el = createElement(node.type());
  } else {
    $el = document.createElement(node.type);
  }
  // const $el = document.createElement(node.type);
  node.children
    .map(createElement)
    .forEach($el.appendChild.bind($el));
  return $el;
}

export function useEffect(callback, dependencies) {
  const id = globalId;
  const parent = globalParent;
  globalId++

  const { cache } = componentState.get(globalParent);
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

export function render(component, parent, props) {
  const state = componentState.get(parent) || { cache: [] };
  componentState.set(parent, { ...state, component, props });
  globalParent = parent;
  const output = component(props);
  console.log(output)
  globalId = 0;
  parent.appendChild(createElement(output));
}