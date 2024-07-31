/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import * as React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';

import HomePage from 'containers/HomePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import StudentsPage from 'containers/StudentsPage/Loadable';

import GlobalStyle from '../../global-styles';
import '../../tw-styles/output.css';

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/students" component={StudentsPage} />
          <Route exact path="/" component={HomePage} />
          <Route component={NotFoundPage} />
        </Switch>
        <GlobalStyle />
      </Router>
    </>
  );
}
export default hot(App);
