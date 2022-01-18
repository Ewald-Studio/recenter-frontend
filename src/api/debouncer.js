import forEach from "lodash/forEach"

const Debouncer = {
  slots: {},
  execDelayed: function (func, timeout, slot) {
    if (this.slots[slot]) {
      clearTimeout(this.slots[slot].t)
    }
    this.slots[slot] = {
      f: func,
      t: setTimeout(function () {
        func(slot)
        Debouncer.clearSlot(slot)
      }, timeout),
    }
  },
  clearSlot: function (slot) {
    if (this.slots[slot]) {
      clearTimeout(this.slots[slot].t)
      delete this.slots[slot]
    }
  },
  finishSlot: function (slot) {
    clearTimeout(this.slots[slot].t)
    this.slots[slot].f(slot)
    delete this.slots[slot]
  },
  finishAll: function () {
    // eslint-disable-next-line
    forEach(this.slots, (value, slot) => this.finishSlot(slot))
  },
}

export default Debouncer
