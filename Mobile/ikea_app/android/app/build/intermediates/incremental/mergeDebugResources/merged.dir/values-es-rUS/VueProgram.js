sWhenAssignedAtPath(path, context) {
        if (path.length === 0)
            return true;
        const trackedExpressions = context.assigned.getEntities(path);
        if (trackedExpressions.has(this))
            return false;
        trackedExpressions.add(this);
        return this.returnExpression.hasEffectsWhenAssignedAtPath(path, context);
    }
    hasEffectsWhenCalledAtPath(path, callOptions, context) {
        const trackedExpressions = (callOptions.withNew
            ? context.instantiated
            : context.called).getEntities(path);
        if (trackedExpressions.has(this))
            return false;
        trackedExpressions.add(this);
        return this.returnExpression.hasEffectsWhenCalledAtPath(path, callOptions, context);
    }
    include(context, includeChildrenRecursively) {
        if (includeChildrenRecursively) {
            super.include(context, includeChildrenRecursively);
            if (includeChildrenRecursively === INCLUDE_PARAMETERS &&
                this.callee instanceof Identifier$1 &&
                this.callee.variable) {
                this.callee.variable.markCalledFromTryStatement();
            }
        }
        else {
            this.included = true;
            this.callee.include(context, false);
        }
        this.callee.includeCallArguments(context, this.arguments);
        if (!this.returnExpression.included) {
            this.returnExpression.include(context, false);
        }
    }
    initialise() {
        this.callOptions = {
            args: this.arguments,
            withNew: false
        };
    }
    render(code, options, { renderedParentType } = BLANK) {
        this.callee.render(code, options);
        if (this.arguments.length > 0) {
            if (this.arguments[this.arguments.length - 1].included) {
                for (const arg of this.arguments) {
                    arg.render(code, options);
                }
            }
            else {
                let lastIncludedIndex = this.arguments.length - 2;
                while (lastIncludedIndex >= 0 && !this.arguments[lastIncludedIndex].included) {
                    lastIncludedIndex--;
                }
                if (lastIncludedIndex >= 0) {
                    for (let index = 0; index <= lastIncludedIndex; index++) {
                        this.arguments[index].render(code, options);
                    }
                    code.remove(findFirstOccurrenceOutsideComment(code.original, ',', this.arguments[lastIncludedIndex].end), this.end - 1);
                }
                else {
                    code.remove(findFirstOccurrenceOutsideComment(code.original, '(', this.callee.end) + 1, this.end - 1);
                }
            }
        }
        if (renderedParentType === ExpressionStatement &&
            this.callee.type === FunctionExpression) {
            code.appendRight(this.start, '(');
            code.prependLeft(this.end, ')');
        }
    }
    getReturnExpression(recursionTracker) {
        if (this.returnExpression === null) {
            this.returnExpression = UNKNOWN_EXPRESSION;
            return (this.returnExpression = this.callee.getReturnExpressionWhenCalledAtPath(EMPTY_PATH, recursionTracker, this));
        }
        return this.returnExpression;
    }
}

class CatchScope extends ParameterScope {
    addDeclaration(identifier, context, init, isHoisted) {
        if (isHoisted) {
            return this.parent.addDeclaration(identifier, context, init, isHoisted);
        }
        else {
            return super.addDeclaration(identifier, context, init, false);
        }
    }
}

class CatchClause extends NodeBase {
    createScope(parentScope) {
        this.scope = new CatchScope(parentScope, this.context);
    }
    initialise() {
        if (this.param) {
            this.param.declare('parameter', UNKNOWN_EXPRESSION);
        }
    }
    parseNode(esTreeNode) {
        this.body = new this.context.nodeConstructors.BlockStatement(esTreeNode.body, this, this.scope);
        super.parseNode(esTreeNode);
    }
}
CatchClause.prototype.preventChildBlockScope = true;

class ClassBody extends NodeBase {
    hasEffectsWhenCalledAtPath(path, callOptions, context) {
        if (path.length > 0)
            return true;
        return (this.classConstructor !== null &&
            this.classConstructor.hasEffectsWhenCalledAtPath(EMPTY_PATH, callOptions, context));
    }
    initialise() {
        for (const method of this.body) {
            if (method.kind === 'constructor') {
                this.classConstructor = method;
                return;
            }
        }
        this.classConstructor = null;
    }
}

class ClassExpression extends ClassNode {
}

class MultiExpression {
    constructor(expressions) {
        this.included = false;
        this.expressions = expressions;
    }
    deoptimizePath(path) {
        for (const expression of this.expressions) {
            expression.deoptimizePath(path);
        }
    }
    getLiteralValueAtPath() {
        return UnknownValue;
    }
    getReturnExpressionWhenCalledAtPath(path, recursionTracker, origin) {
        return new MultiExpression(this.expressions.map(expression => expression.getReturnExpressionWhenCalledAtPath(path, recursionTracker, origin)));
    }
    hasEffectsWhenAccessedAtPath(path, context) {
        for (const expression of this.expressions) {
            if (expression.hasEffectsWhenAccessedAtPath(path, context))
                return true;
        }
        return false;
    }
    hasEffectsWhenAssignedAtPath(path, context) {
        for (const expression of this.expressions) {
            if (expression.hasEffectsWhenAssignedAtPath(path, context))
                return true;
        }
        return false;
    }
    hasEffectsWhenCalledAtPath(path, callOptions, context) {
        for (const expression of this.expressions) {
            if (expression.hasEffectsWhenCalledAtPath(path, callOptions, context))
                return true;
        }
        return false;
    }
    include() { }
    includeCallArguments() { }
}

class ConditionalExpression extends NodeBase {
    constructor() {
        super(...arguments);
        this.expressionsToBeDeoptimized = [];
        this.isBranchResolutionAnalysed = false;
        this.usedBranch = null;
        this.wasPathDeoptimizedWhileOptimized = false;
    }
    bind() {
        super.bind();
        // ensure the usedBranch is set for the tree-shaking passes
        this.getUsedBranch();
    }
    deoptimizeCache() {
        if (this.usedBranch !== null) {
            const unusedBranch = this.usedBranch === this.consequent ? this.alternate : this.consequent;
            this.usedBranch = null;
            const expressionsToBeDeoptimized = this.expressionsToBeDeoptimized;
            this.expressionsToBeDeoptimized = [];
            if (this.wasPathDeoptimizedWhileOptimized) {
                unusedBranch.deoptimizePath(UNKNOWN_PATH);
            }
            for (const expression of expressionsToBeDeoptimized) {
                expression.deoptimizeCache();
            }
        }
    }
    deoptimizePath(path) {
        if (path.length > 0) {
            const usedBranch = this.getUsedBranch();
            if (usedBranch === null) {
                this.consequent.deoptimizePath(path);
                this.alternate.deoptimizePath(path);
            }
            else {
                this.wasPathDeoptimizedWhileOptimized = true;
                usedBranch.deoptimizePath(path);
            }
        }
    }
    getLiteralValueAtPath(path, recursionTracker, origin) {
        const usedBranch = this.getUsedBranch();
        if (usedBranch === null)
            return UnknownValue;
        this.expressionsToBeDeoptimized.push(origin);
        return usedBranch.getLiteralValueAtPath(path, recursionTracker, origin);
    }
    getReturnExpressionWhenCalledAtPath(path, recursionTracker, origin) {
        const usedBranch = this.getUsedBranch();
        if (usedBranch === null)
            return new MultiExpression([
                this.consequent.getReturnExpressionWhenCalledAtPath(path, recursionTracker, origin),
                this.alternate.getReturnExpressionWhenCalledAtPath(path, recursionTracker, origin)
            ]);
        this.expressionsToBeDeoptimized.push(origin);
        return usedBranch.getReturnExpressionWhenCalledAtPath(path, recursionTracker, origin);
    }
    hasEffects(context) {
        if (this.test.hasEffects(context))
            return true;
        if (this.usedBranch === null) {
            return this.consequent.hasEffects(context) || this.alternate.hasEffects(context);
        }
        return this.usedBranch.hasEffects(context);
    }
    hasEffectsWhenAccessedAtPath(path, context) {
        if (path.length === 0)
            return false;
        if (this.usedBranch === null) {
            return (this.consequent.hasEffectsWhenAccessedAtPath(path, context) ||
                this.alternate.hasEffectsWhenAccessedAtPath(path, context));
        }
        return this.usedBranch.hasEffectsWhenAccessedAtPath(path, context);
    }
    hasEffectsWhenAssignedAtPath(path, context) {
        if (path.length === 0)
            return true;
        if (this.usedBranch === null) {
            return (this.consequent.hasEffectsWhenAssignedAtPath(path, context) ||
                this.alternate.hasEffectsWhenAssignedAtPath(path, context));
        }
        return this.usedBranch.hasEffectsWhenAssignedAtPath(path, context);
    }
    hasEffectsWhenCalledAtPath(path, callOptions, context) {
        if (this.usedBranch === null) {
            return (this.consequent.hasEffectsWhenCalledAtPath(path, callOptions, context) ||
                this.alternate.hasEffectsWhenCalledAtPath(path, callOptions, context));
        }
        return this.usedBranch.hasEffectsWhenCalledAtPath(path, callOptions, context);
    }
    include(context, includeChildrenRecursively) {
        this.included = true;
        if (includeChildrenRecursively ||
            this.test.shouldBeIncluded(context) ||
            this.usedBranch === null) {
            this.test.include(context, includeChildrenRecursively);
            this.consequent.include(context, includeChildrenRecursively);
            this.alternate.include(context, includeChildrenRecursively);
        }
        else {
            this.usedBranch.include(context, includeChildrenRecursively);
        }
    }
    render(code, options, { renderedParentType, isCalleeOfRenderedParent, preventASI } = BLANK) {
        if (!this.test.included) {
            const colonPos = findFirstOccurrenceOutsideComment(code.original, ':', this.consequent.end);
            const inclusionStart = (this.consequent.included
                ? findFirstOccurrenceOutsideComment(code.original, '?', this.test.end)
                : colonPos) + 1;
            if (preventASI) {
                removeLineBreaks(code, inclusionStart, this.usedBranch.start);
            }
            code.remove(this.start, inclusionStart);
            if (this.consequent.included) {
                code.remove(colonPos, this.end);
            }
            removeAnnotations(this, code);
            this.usedBranch.render(code, options, {
                isCalleeOfRenderedParent: renderedParentType
                    ? isCalleeOfRenderedParent
                    : this.parent.callee === this,
                renderedParentType: renderedParentType || this.parent.type
            });
        }
        else {
            super.render(code, options);
        }
    }
    getUsedBranch() {
        if (this.isBranchResolutionAnalysed) {
            return this.usedBranch;
        }
        this.isBranchResolutionAnalysed = true;
        const testValue = this.test.getLiteralValueAtPath(EMPTY_PATH, SHARED_RECURSION_TRACKER, this);
        return testValue === UnknownValue
            ? null
            : (this.usedBranch = testValue ? this.consequent : this.alternate);
    }
}

class ContinueStatement extends NodeBase {
    hasEffects(context) {
        if (this.label) {
            if (!context.ignore.labels.has(this.label.name))
                return tru