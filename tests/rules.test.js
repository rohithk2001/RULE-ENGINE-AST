const { 
    Node, 
    createSimpleRule, 
    combineRules, 
    evaluateRule,
    modifyOperator, 
    modifyOperand, 
    addSubExpression, 
    removeSubExpression 
} = require('../rules');

describe('AST Rule Engine', () => {
    
    test('should create a simple rule', () => {
        const ruleString = "age > 30";
        const ast = createSimpleRule(ruleString, ['age']);
        
        expect(ast).toBeInstanceOf(Node);
        expect(ast.left).toBeInstanceOf(Node);  // Left child should be a Node
        expect(ast.right).toBeInstanceOf(Node);  // Right child should be a Node
        expect(ast.left.value).toBe("age > 30");
        expect(ast.right.value).toBe("department = 'Sales'");
        expect(ast.value).toBe("AND");  // The root operator is AND
    });
    
    test('should combine two rules with AND', () => {
        const rule1 = new Node('operand', null, null, "age > 30");
        const rule2 = new Node('operand', null, null, "salary > 50000");
        const combinedAST = combineRules(rule1, rule2, 'AND');

        expect(combinedAST).toBeInstanceOf(Node);
        expect(combinedAST.left.value).toBe("age > 30");
        expect(combinedAST.right.value).toBe("salary > 50000");
        expect(combinedAST.value).toBe("AND");
    });

    test('should evaluate a rule and return true', () => {
        const ast = new Node('operand', null, null, "age > 30");
        const data = { age: 35 };
        const result = evaluateRule(ast, data);
        expect(result).toBe(true);
    });

    test('should evaluate a rule and return false', () => {
        const ast = new Node('operand', null, null, "age > 30");
        const data = { age: 25 };
        const result = evaluateRule(ast, data);
        expect(result).toBe(false);
    });

    test('should modify the operator of a rule', () => {
        const ast = new Node('operator', new Node('operand', null, null, "age > 30"), new Node('operand', null, null, "salary > 50000"), 'AND');
        const modifiedAST = modifyOperator(ast, 'OR');

        expect(modifiedAST.value).toBe('OR');
    });

    test('should modify the operand of a rule', () => {
        const ast = new Node('operand', null, null, "age > 30");
        const modifiedAST = modifyOperand(ast, "age < 25");

        expect(modifiedAST.value).toBe("age < 25");
    });

    test('should add a sub-expression to the rule', () => {
        const ast = new Node('operand', null, null, "age > 30");
        const subExpression = new Node('operand', null, null, "salary > 50000");
        const newAST = addSubExpression(ast, subExpression, 'AND');

        expect(newAST.left.value).toBe("age > 30");
        expect(newAST.right.value).toBe("salary > 50000");
        expect(newAST.value).toBe("AND");
    });

    test('should remove a sub-expression from the rule', () => {
        const ast = new Node('operator', new Node('operand', null, null, "age > 30"), new Node('operand', null, null, "salary > 50000"), 'AND');
        const newAST = removeSubExpression(ast, 'right');

        expect(newAST).toBeInstanceOf(Node);
        expect(newAST.value).toBe("age > 30");
    });

});
