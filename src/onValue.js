import { listenTo, createRef } from './helpers'

export default function createOnValue(path, signal, options = {}) {
  let hasEmittedInitialValue = false
  listenTo(createRef(path, options), path, 'value', signal, (data) => {
    if (!hasEmittedInitialValue) {
      hasEmittedInitialValue = true
      return
    }

    this.context.controller.getSignal(signal)(
      Object.assign({ value: data.val() }, options.payload || {})
    )
  })
}
