class FunctionBuilder {
  constructor(name, args, options, type, body = null) {
    this.name = name;
    this.args = args;
    this.body = body;
    this.type = type;
    this.options = options;
  }

  build(fnName) {
    return `
${this.type ? `${this.type} ` : ""}function ${fnName} (${Object.values(
      this.args
    )}) { 
        ${this.body ? this.body : ""}
}`;
  }

  injectBody(body) {
    this.body = body;
  }

  static attachMethod(instance, methodName, params) {
    return `
${instance}.${methodName}(${Object.values(params.filter((p) => p !== ""))})`;
  }
}

module.exports = FunctionBuilder;
