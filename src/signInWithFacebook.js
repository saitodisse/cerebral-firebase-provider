import firebase from 'firebase'
import { createUser } from './helpers'
import { FirebaseProviderAuthenticationError } from './errors'

export default function signInWithFacebook(options) {
  const scopes = options.scopes || []
  const redirect = options.redirect || false
  const provider = new firebase.auth.FacebookAuthProvider()

  scopes.forEach((scope) => {
    provider.addScope(scope)
  })

  return new Promise((resolve, reject) => {
    if (redirect) {
      firebase.auth().signInWithRedirect(provider)
      resolve()
    } else {
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(
          (result) => {
            const user = createUser(result.user)

            user.accessToken = result.credential.accessToken
            resolve(createUser(user))
          },
          (error) => {
            reject(new FirebaseProviderAuthenticationError(error))
          }
        )
    }
  })
}
