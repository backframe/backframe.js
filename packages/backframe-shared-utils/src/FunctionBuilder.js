class FunctionBuilder {
  constructor(name, type, args, options, body = null) {
    this.name = name;
    this.args = args;
    this.body = body;
    this.type = type;
    this.options = options;
  }

  build(fnName) {
    return `
${this.type ? `${this.type} ` : ""}function ${fnName} (${this.args.req} \, ${
      this.args.res
    }) { 
        ${this.body}
}`;
  }

  injectBody(body) {
    this.body = body;
  }
}

module.exports = FunctionBuilder;
