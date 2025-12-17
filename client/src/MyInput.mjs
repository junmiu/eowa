import { Component, html } from './Component.mjs';

export class MyInput extends Component {
  render() {
    return html`
      <input 
        required
        type="text" 
        placeholder="Enter text" 
        aria-label="Input Field"
      />
    `;
  }
}
