import { listenTo, createRef } from './helpers'

export default function onChildRemoved(path, signal, options = {}) {
  listenTo(createRef(path, options), path, 'child_removed', signal, (data) => {
    this.context.controller.getSignal(signal)(
      Object.assign(
        {
          key: data.key,
        },
        options.payload
      )
    )
  })
}
