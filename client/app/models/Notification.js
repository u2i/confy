import { v4 as uuid } from 'node-uuid';

export default class Notification {
  constructor(type, text) {
    this.type = type;
    this.text = text;
    this.id = uuid();
  }
}
