import { createRef, snapshotToArray } from './helpers'
import { FirebaseProviderError } from './errors'

export default function value(path, options = {}) {
  const ref = createRef(path, options)

  return ref
    .once('value')
    .then((snapshot) => {
      if (options.asArray && 'forEach' in snapshot) {
        return {
          key: snapshot.key,
          value: snapshotToArray(snapshot),
        }
      }

      return {
        key: snapshot.key,
        value: snapshot.val(),
      }
    })
    .catch((error) => {
      throw new FirebaseProviderError(error)
    })
}
