import type { Directive } from 'vue';
import { fauxTrack as umTrackEvent } from '../internal/demo';
import { helloDebugger } from '../internal/debug';

// import { umTrackEvent } from '../utils/umami';

// "savory" is a fun synonym for umami, why?
// 1. dodge script blockers
// 2. prevent conflicts with user attrs
// + it's fun 😅
const ATTR_NAME = 'savoryName';
const ATTR_DATA = 'savoryData';

type BindingValue = string | {
  name: string
  [k: string]: string | boolean | number
};

async function setAttributes(el: HTMLElement, value: BindingValue) {
  let name = '';
  let data = '';

  if (typeof value === 'string') {
    name = value;
  } else {
    try {
      if (typeof value !== 'object' || value === null) {
        throw new TypeError('invalid directive value');
      }

      // TODO: flatten out nested objects (?)
      const { name: vName = '', ...rawData } = value;
      const vData = Object.keys(rawData).length > 0
        ? JSON.stringify(rawData)
        : '';
      [name, data] = [vName, vData];
    } catch (err) {
      helloDebugger('err-directive', value);
    }
  }

  const attr = el.dataset;
  [attr[ATTR_NAME], attr[ATTR_DATA]] = [name, data];
}

function getAttributes(el: HTMLElement) {
  const name = el.dataset[ATTR_NAME] || '';
  let data = null;

  try {
    data = JSON.parse(el.dataset[ATTR_DATA] || '');
  } catch (error) {}

  return { name, data };
}

function eventHandler(el: HTMLElement) {
  return () => {
    const { name, data } = getAttributes(el);

    if (!name && !data) {
      return;
    }

    umTrackEvent(name, data);
  };
}

const directive: Directive<HTMLElement, BindingValue> = {
  mounted(el, { value }) {
    setAttributes(el, value);
    el.addEventListener('click', eventHandler(el), { passive: true });
  },
  updated(el, { value }) {
    setAttributes(el, value);
  },
  beforeUnmount(el) {
    el.removeEventListener('click', eventHandler(el));
  },
};

export { directive };
