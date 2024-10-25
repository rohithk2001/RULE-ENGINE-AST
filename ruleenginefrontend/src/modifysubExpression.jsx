import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModifySubExpression = () => {
  const [rules, setRules] = useState([]);
  const [selectedRuleId, setSelectedRuleId] = useState('');
  const [action, setAction] = useState('add'); // 'add' or 'remove'
  const [subExpression, setSubExpression] = useState('');
  const [operator, setOperator] = useState('AND'); // AND/OR for adding
  const [side, setSide] = useState('left'); // For removing: 'left' or 'right'

  useEffect(() => {
    // Fetch rules to display in dropdown
    const fetchRules = async () => {
      try {
        const response = await axios.get('http://localhost:3000/rules');
        setRules(response.data);
      } catch (error) {
        console.error('Error fetching rules:', error);
      }
    };

    fetchRules();
  }, []);

  const modifySubExpression = async () => {
    try {
      // Validate sub-expression format before sending the request
      if (action === 'add' && !subExpression.match(/^[a-zA-Z]+\s*(>|<|=)\s*\d+$/)) {
        alert('Invalid sub-expression format. Example: salary > 50000');
        return;
      }

      const response = await axios.post('http://localhost:3000/modify-subexpression', {
        ruleId: selectedRuleId,
        action,
        subExpression: action === 'add' ? subExpression : null, // Only send subExpression for 'add' action
        operator,
        side, // 'left' or 'right' for remove
      });
      alert('Sub-expression modified successfully!');
    } catch (error) {
      console.error('Error modifying sub-expression:', error);
      alert('Failed to modify sub-expression.');
    }
  };

  return (
    <div>
      <h2>Modify Sub-Expression</h2>
      <div>
        <label>Select Rule:</label>
        <select onChange={(e) => setSelectedRuleId(e.target.value)} value={selectedRuleId}>
          <option value="">--Select a Rule--</option>
          {rules.map(rule => (
            <option key={rule._id} value={rule._id}>{rule.ruleString}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Action:</label>
        <select onChange={(e) => setAction(e.target.value)} value={action}>
          <option value="add">Add Sub-Expression</option>
          <option value="remove">Remove Sub-Expression</option>
        </select>
      </div>

      {action === 'add' && (
        <div>
          <label>Sub-Expression (e.g., salary &gt; 50000):</label>
          <input 
            type="text" 
            value={subExpression} 
            onChange={(e) => setSubExpression(e.target.value)} 
            placeholder="Enter new sub-expression" 
          />
          <label>Operator:</label>
          <select onChange={(e) => setOperator(e.target.value)} value={operator}>
            <option value="AND">AND</option>
            <option value="OR">OR</option>
          </select>
        </div>
      )}

      {action === 'remove' && (
        <div>
          <label>Remove Side:</label>
          <select onChange={(e) => setSide(e.target.value)} value={side}>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>
      )}

      <button onClick={modifySubExpression}>Modify Sub-Expression</button>
    </div>
  );
};

export default ModifySubExpression;
