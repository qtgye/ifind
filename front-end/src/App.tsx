import { BrowserRouter as Router } from "react-router-dom";

import Layout from './Layout';
import { ENVIRONMENT } from '@config/environment';
import GridGuide from "@components/GridGuide";

import "./App.scss";

function App() {
  return (
    <Router>
      <Layout />
      <GridGuide renderIf={true} />
    </Router>
  );
}

export default App;
