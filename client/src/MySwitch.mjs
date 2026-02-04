import { Component, html } from './Component.mjs';

export class MySwitch extends Component {
  static observedAttributes = ['checked'];

  state = {
    checked: this.hasAttribute('checked'),
  };

  toggle() {
    this.state.checked = !this.state.checked;
    this.dispatchEvent(new CustomEvent('change', { detail: { checked: this.state.checked } }));
  }

  render() {
    return html`
      <style>
        .switch {
          display: inline-block;
          width: 60px;
          height: 34px;
          position: relative;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: ${this.state.checked ? '#4CAF50' : '#ccc'};
          transition: .4s;
          border-radius: 34px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
          transform: translateX(${this.state.checked ? '26px' : '0'});
        }
      </style>
      <div class="switch" @click="${() => this.toggle()}">
        <div class="slider"></div>
      </div>
      <slot></slot>
    `;
  }
}
