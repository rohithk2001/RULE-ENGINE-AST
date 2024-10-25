import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModifyRule = () => {
  const [rules, setRules] = useState([]);
  const [selectedRuleId, setSelectedRuleId] = useState('');
  const [modificationType, setModificationType] = useState('operator'); // 'operator' or 'operand'
  const [newValue, setNewValue] = useState('');
  const [side, setSide] = useState('left'); // 'left' or 'right' for operand modification

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

  const modifyRule = async () => {
    try {
      const response = await axios.post('http://localhost:3000/modify-rule', {
        ruleId: selectedRuleId,
        modificationType,
        newValue,
        side,
      });
      alert('Rule modified successfully!');
    } catch (error) {
      console.error('Error modifying rule:', error);
      alert('Failed to modify rule.');
    }
  };

  return (
    <div>
      <h2>Modify Rule</h2>
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
        <label>Modification Type:</label>
        <select onChange={(e) => setModificationType(e.target.value)} value={modificationType}>
          <option value="operator">Modify Operator</option>
          <option value="operand">Modify Operand</option>
        </select>
      </div>

      {modificationType === 'operand' && (
        <div>
          <label>Side (for operand modification):</label>
          <select onChange={(e) => setSide(e.target.value)} value={side}>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>
      )}

      <div>
        <label>New Value:</label>
        <input type="text" value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="Enter new value (e.g., age > 25)" />
      </div>

      <button onClick={modifyRule}>Modify Rule</button>
    </div>
  );
};

export default ModifyRule;
