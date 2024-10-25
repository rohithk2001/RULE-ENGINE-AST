import React from 'react';
import CreateRule from './CreateRule';
import ViewRules from './ViewRules';
import EvaluateRule from './EvaluateRule';
import ModifyRule from './ModifyRule';
import ModifySubExpression from './modifysubExpression';
import './styles.css';


function App() {
  return (
    <div className="container">
      <div classname="button-container">
  
      <h1>Rule Engine</h1>
      <CreateRule />
      <ViewRules />
      <EvaluateRule />
      <ModifyRule/>
      <ModifySubExpression/>
        
      </div>
    </div>
  );
}

export default App;
