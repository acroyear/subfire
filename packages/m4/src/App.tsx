import React, { ComponentType } from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import Pages from './pages';
const Routes = Pages as any;
console.log(Routes);
const routes = Object.keys(Routes).map((route) => {
  console.log(route);
  const path = '/' + route
    .replace(/\/src\/pages|index|\.tsx$/g, '')
    .replace(/\[\.{3}.+\]/, '*')
    .replace(/\[(.+)\]/, ':$1')

  return { path, component: Routes[route] as ComponentType }
})

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Switch>
          {routes.map(({ path, component = React.Fragment }) => (
            <Route key={path} path={path} component={component} exact={false} />
          ))}
        </Switch>
      </header>
    </div>
  );
}

export default App;
