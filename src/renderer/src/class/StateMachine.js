class StateMachine {
  constructor(initialState) {
    this.currentState = initialState;
    this.states = {};
  }

  addState(name, { onEnter, onExit, onUpdate, onRender }) {
    this.states[name] = { onEnter, onExit, onUpdate, onRender };
  }

  changeState(newState) {
    if (this.currentState) {
      if (this.states[this.currentState].onExit) {
        this.states[this.currentState].onExit();
      }
    }

    this.currentState = newState;

    if (this.states[this.currentState].onEnter) {
      this.states[this.currentState].onEnter();
    }
  }

  update() {
    if (this.states[this.currentState] && this.states[this.currentState].onUpdate) {
      this.states[this.currentState].onUpdate();
    }
  }

  render(ctx) {
    if (this.states[this.currentState] && this.states[this.currentState].onRender) {
      this.states[this.currentState].onRender(ctx);
    }
  }
}

export default StateMachine;