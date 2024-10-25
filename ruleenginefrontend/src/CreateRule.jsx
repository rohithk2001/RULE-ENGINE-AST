import React, { useState } from 'react';
import axios from 'axios';

const CreateRule = () => {
  const [ruleString, setRuleString] = useState('');

  const createRule = async () => {
    try {
      const response = await axios.post('http://localhost:3000/create-rule', { ruleString });
      alert('Rule created: ' + response.data.rule.ruleString);
    } catch (error) {
      console.error('Error creating rule:', error);
      alert('Failed to create rule.');
    }
  };

  return (
    <div>
      <h2>Create Rule</h2>
      <input 
        type="text" 
        value={ruleString} 
        onChange={(e) => setRuleString(e.target.value)} 
        placeholder="Enter rule (e.g., age > 30)"
      />
      <button onClick={createRule}>Create Rule</button>
    </div>
  );
};

export default CreateRule;
