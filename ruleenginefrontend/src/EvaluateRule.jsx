import React, { useState } from 'react';
import axios from 'axios';

const EvaluateRule = () => {
  const [ast, setAST] = useState('');
  const [data, setData] = useState('');

  const evaluateRule = async () => {
    try {
      const response = await axios.post('http://localhost:3000/evaluate-rule', {
        ast: JSON.parse(ast),
        data: JSON.parse(data),
      });
      alert('Evaluation result: ' + response.data.result);
    } catch (error) {
      console.error('Error evaluating rule:', error);
      alert('Failed to evaluate rule.');
    }
  };

  return (
    <div>
      <h2>Evaluate Rule</h2>
      <textarea 
        value={ast} 
        onChange={(e) => setAST(e.target.value)} 
        placeholder="Enter AST (in JSON format)"
      />
      <textarea 
        value={data} 
        onChange={(e) => setData(e.target.value)} 
        placeholder="Enter data (in JSON format)"
      />
      <button onClick={evaluateRule}>Evaluate</button>
    </div>
  );
};

export default EvaluateRule;
