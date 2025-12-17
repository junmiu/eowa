import { render, html as litHtml } from 'lit-html';
import { isReactive, reactive, effect } from '@vue/reactivity';

export const html = litHtml;

export class Component extends HTMLElement {
  connectedCallback() {
    if (!isReactive(this.state)) {
      this.state = reactive(this.state || {});
    }
    effect(() => {
      console.log('State changed:');
      this.rerender();
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.state[name] = newValue === 'true' ? true : newValue === 'false' ? false : newValue;
  }

  rerender() {
    render(this.render(), this);
  }
}
