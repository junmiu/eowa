import { Component, html } from './Component.mjs';
import './MyInput.mjs';

export class MyForm extends Component {
  render() {
    return html`
      <form>
        <div class="form-group">
          <label for="name">Name:</label>
          <my-input 
            id="name" 
            name="name"
            type="text" 
            placeholder="Enter your name" 
            aria-label="Name"
          ></my-input>
        </div>
        <div class="form-group">
          <label for="pwd">Password:</label>
          <input required>
          <my-input 
            id="pwd" 
            name="password"
            type="password" 
            placeholder="Enter your password" 
            aria-label="Password"
          ></my-input>
        </div>
        <button @click=${this.handleSubmit}>Submit</button>
      </form>
    `;
  }

  handleSubmit(event) {
    event.preventDefault();
    const form = event.target.closest('form');
    const formData = new FormData(form);
    fetch('http://localhost:3000/userinfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name: formData.get('name'), password: formData.get('password')}),
    }).then(response => {
      if (response.ok) {
        console.log('Form submitted successfully');
      } else {
        console.error('Form submission failed');
      }
    }).catch(error => {
      console.error('Error submitting form:', error);
    });
  }
}
