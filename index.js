const express = require('express');
// const { createSimpleRule, combineRules } = require('./rules');  // Import rule logic
const { 
    createSimpleRule, 
    combineRules, 
    evaluateRule, 
    modifyOperator,       // Import modifyOperator
    modifyOperand,        // Import modifyOperand
    addSubExpression,     // Import addSubExpression
    removeSubExpression   // Import removeSubExpression
} = require('./rules');
const connectDB = require('./ruleast.db');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());

const port = 3000;
// Call the function to connect to MongoDB
connectDB();
app.use(cors());
// Define Rule Schema
const ruleSchema = new mongoose.Schema({
    ruleString: String,
    ast: Object,  // We'll store the AST as a JSON object
    userDefinedAttributes: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now }
});

// Define Node Class
class Node {
    constructor(type, operator, left, right) {
        this.type = type;      
        this.operator = operator; 
        this.left = left;      
        this.right = right;    
    }
}
// Create the Rule model
const Rule = mongoose.model('Rule', ruleSchema);

// API route to create & save a simple rule
app.post('/create-rule', async (req, res) => {
    const { ruleString } = req.body;
    try {
        const ast = createSimpleRule(ruleString, []); // Pass user-defined attributes
        const newRule = new Rule({ ruleString, ast });
        await newRule.save();
        res.json({ message: 'Rule created and saved!', rule: newRule });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// API route to combine two rules
app.post('/combine-rules', (req, res) => {
    const { rule1, rule2, operator } = req.body;

    // Combine the two rules using the operator (AND/OR)
    const combinedAST = combineRules(rule1, rule2, operator);
    res.json({ message: 'Rules combined!', combinedAST });
});

// API route to evaluate a rule against user data
app.post('/evaluate-rule', (req, res) => {
    const { ast, data } = req.body;
    try {
        const result = evaluateRule(ast, data);
        res.json({ message: 'Evaluation result', result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Fetch all saved rules from MongoDB
app.get('/rules', async (req, res) => {
    try {
        const rules = await Rule.find();  // Retrieve all saved rules
         // Convert createdAt from UTC to IST before sending the response
        const rulesWithIST = rules.map(rule => {
        const istTime = new Date(rule.createdAt).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
        return {
          ...rule._doc, // Spread existing rule data
          createdAt: istTime // Overwrite createdAt with IST version
        };
      });
  
        res.json(rulesWithIST);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve rules' });
    }
});

// Modify the operator or operand of an existing rule
app.post('/modify-rule', async (req, res) => {
    const { ruleId, modificationType, newValue, side } = req.body;
    
    try {
        const rule = await Rule.findById(ruleId);  // Fetch the rule by ID
        
        if (!rule) {
            return res.status(404).json({ error: 'Rule not found' });  // Handle case where rule doesn't exist
        }

        let modifiedAST;

        // Modify based on the type of modification
        if (modificationType === 'operator') {
            modifiedAST = modifyOperator(rule.ast, newValue);
        } else if (modificationType === 'operand') {
            modifiedAST = modifyOperand(rule.ast[side], newValue);
        }

        // Save modified rule
        rule.ast = modifiedAST;
        await rule.save();
        res.json({ message: 'Rule modified successfully', rule });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// Add or remove a sub-expression in the rule's AST
app.post('/modify-subexpression', async (req, res) => {
    const { ruleId, action, subExpression, operator, side } = req.body;  // action: "add" or "remove"
    
    try {
      const rule = await Rule.findById(ruleId);  // Fetch the rule by ID
      
      if (!rule) {
        return res.status(404).json({ error: 'Rule not found' });
      }
      
      let modifiedAST;
  
      if (action === 'add') {
        const newSubExpression = new Node('operand', null, null, subExpression);  // Create a new sub-expression
        modifiedAST = addSubExpression(rule.ast, newSubExpression, operator);     // Add the sub-expression
      } else if (action === 'remove') {
        modifiedAST = removeSubExpression(rule.ast, side);  // Remove the sub-expression (left/right)
      }
  
      // Save the modified AST
      rule.ast = modifiedAST;
      await rule.save();
      
      res.json({ message: 'Sub-expression modified successfully', rule });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});



module.exports = app;