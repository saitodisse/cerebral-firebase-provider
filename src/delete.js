import { createStorageRef, noop as noReturnValue } from './helpers'
import { FirebaseProviderError } from './errors'

export default function deleteFile(path, filename) {
  const ref = createStorageRef(path).child(filename)

  return ref
    .delete()
    .then(noReturnValue)
    .catch((error) => {
      throw new FirebaseProviderError(error)
    })
}
