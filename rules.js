// rules.js

// rules.js

// Node structure for AST
const { validAttributes } = require('./config');
class Node {
    constructor(type, left = null, right = null, value = null) {
        this.type = type;    // "operator" for AND/OR, "operand" for conditions
        this.left = left;    // Left child (for operators)
        this.right = right;  // Right child (for operators)
        this.value = value;  // Value for operands (e.g., "age > 30")
    }
}

const validOperators = ['>', '<', '=', 'AND', 'OR'];
// const validAttributes = ['age', 'salary', 'department'];  // Example of a simple attribute catalog
// Function to validate rule string format and check for valid attributes
function validateRuleString(ruleString, userDefinedAttributes = []) {
    const tokens = ruleString.split(' ');

    if (tokens.length < 3 || tokens.length % 2 === 0) {
        throw new Error('Invalid rule format: Rule should contain operands and operators.');
    }

    const allValidAttributes = [...validAttributes, ...userDefinedAttributes = []];

    for (let i = 0; i < tokens.length; i++) {
        if (i % 2 === 0) {
            if (!allValidAttributes.includes(tokens[i]) && isNaN(parseInt(tokens[i]))) {
                throw new Error(`Invalid attribute or value: ${tokens[i]}`);
            }
        } else {
            if (!validOperators.includes(tokens[i])) {
                throw new Error(`Invalid operator: ${tokens[i]}`);
            }
        }
    }

    return true;
}


// Example function to create a simple rule
function createSimpleRule(ruleString, userDefinedAttributes) {
    try {
        validateRuleString(ruleString, userDefinedAttributes);
        
        // Example AST creation (you can enhance this logic)
        const leftOperand = new Node('operand', null, null, 'age > 30');
        const rightOperand = new Node('operand', null, null, "department = 'Sales'");
        const root = new Node('operator', leftOperand, rightOperand, 'AND');

        return root;
    } catch (error) {
        throw new Error(`Failed to create rule: ${error.message}`);
    }
}


// Function to combine two rules using an operator (AND/OR)
function combineRules(rule1, rule2, operator) {
    const combinedRoot = new Node('operator', rule1, rule2, operator);
    return combinedRoot;
}

// rules.js

// Function to evaluate an AST node against user data
function evaluateRule(ast, data) {
    if (ast.type === 'operand') {
        // Extract the condition and evaluate it using the user data
        const [attribute, operator, value] = ast.value.split(' ');

        // Handle different operators
        switch (operator) {
            case '>':
                return data[attribute] > parseInt(value);
            case '<':
                return data[attribute] < parseInt(value);
            case '=':
                return data[attribute] === value.replace(/['"]+/g, '');  // Remove quotes from strings
            default:
                return false;
        }
    } else if (ast.type === 'operator') {
        const leftEval = evaluateRule(ast.left, data);  // Recursively evaluate the left child
        const rightEval = evaluateRule(ast.right, data);  // Recursively evaluate the right child

        // Evaluate AND/OR operators
        if (ast.value === 'AND') {
            return leftEval && rightEval;
        } else if (ast.value === 'OR') {
            return leftEval || rightEval;
        }
    }
    return false;
}

// Modify operator in the rule's AST
function modifyOperator(ast, newOperator) {
    if (ast.type === 'operator') {
        ast.value = newOperator;
    } else {
        throw new Error('Cannot modify operator on a non-operator node.');
    }
    return ast;
}

// Modify operand value in the rule's AST
function modifyOperand(ast, newOperand) {
    if (ast.type === 'operand') {
        ast.value = newOperand;
    } else {
        throw new Error('Cannot modify operand on a non-operand node.');
    }
    return ast;
}

// Add a new sub-expression to the rule's AST
function addSubExpression(ast, newSubExpression, operator = 'AND') {
    // Create a new root node with the existing AST and the new sub-expression
    return new Node('operator', ast, newSubExpression, operator);
}

// Remove a sub-expression (left or right) from the AST
function removeSubExpression(ast, side = 'left') {
    if (ast.type !== 'operator') {
        throw new Error('Cannot remove sub-expression from a non-operator node.');
    }
    
    if (side === 'left') {
        return ast.right;  // Return the right side if left is removed
    } else if (side === 'right') {
        return ast.left;  // Return the left side if right is removed
    } else {
        throw new Error('Invalid side to remove.');
    }
}



module.exports = { Node, createSimpleRule, combineRules, evaluateRule,modifyOperand , modifyOperator,addSubExpression,removeSubExpression };




