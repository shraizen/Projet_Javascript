import _ from 'lodash';
import './style.css';

function component() {
  const element = document.createElement('div');

  // Lodash, now imported by this scripts
  element.innerHTML = "Salut ma couille";
  element.classList.add('hello');
  console.log('I get called from print.js!');
  return element;
}

document.body.appendChild(component());