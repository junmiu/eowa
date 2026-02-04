import { render, html as litHtml } from 'lit-html';
import { isReactive, reactive, effect } from '@vue/reactivity';

export const html = litHtml;

export class Component extends HTMLElement {
  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: 'open' });
    if (!isReactive(this.state)) {
      this.state = reactive(this.state || {});
    }

    effect(() => {
      this.rerender(shadowRoot);
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.state[name] = newValue == null ? false : true;
  }

  rerender(node) {
    render(this.render(), node);
  }
}
