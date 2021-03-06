import { listenTo, createRef } from './helpers'

export default function onChildAdded(path, signal, options = {}) {
  listenTo(createRef(path, options), path, 'child_added', signal, (data) => {
    this.context.controller.getSignal(signal)(
      Object.assign(
        {
          key: data.key,
          value: data.val(),
        },
        options.payload || {}
      )
    )
  })
}
