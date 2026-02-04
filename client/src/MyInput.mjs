import { Component, html } from './Component.mjs';

export class MyInput extends Component {
  static observedAttributes = ['required'];
  state = {
    required: this.hasAttribute('required'),
  };

  render() {
    return html`
      <style>
        label:has(+ input:required)::after {
          content: ' *';
          color: red;
        }
      </style>
      <div>
        <label>My Input:</label>
        <input
          ?required="${this.state.required}"  
          type="text" 
          placeholder="Enter text" 
        />
      </div>
    `;
  }
}
