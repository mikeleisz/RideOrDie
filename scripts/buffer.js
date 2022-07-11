class Buffer {
  data = [];
  offset = 0;

  constructor() {}

  get(idx) {
    return this.data[(idx - this.offset)];
  }

  set(idx, obj) {
    this.data[idx - this.offset] = obj;
  }

  push(obj) {
    this.data.push(obj);
  }

  get length() {
    return this.data.length + this.offset;
  }

  get trueLength() {
    return this.data.length;
  }

  empty() {
    this.data = [];
    this.offset = 0;
  }

  cleanBehind(idx) {
    const trueIndex = idx - this.offset;
    this.data = this.data.slice(trueIndex);
    this.offset += trueIndex;
  }

  findIndex(check) {
    const idx = this.data.findIndex(check);
    if (idx === -1) {
      return -1;
    }
    return idx + this.offset;
  }
}
