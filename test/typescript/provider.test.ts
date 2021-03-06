import {
  default as Provider,
  FirebaseProvider,
  OnChildOptions,
  PutOptions,
} from '../..'

export const firebase = Provider({
  config: {
    apiKey: 'SOME-API-KEY',
    authDomain: 'domain-1234.firebaseapp.com',
    databaseURL: 'https://domain-1234.firebaseio.com',
    projectId: 'domain-1234',
    storageBucket: 'domain-1234.appspot.com',
    messagingSenderId: '123412341234',
  },
  specPrefix: 'CJ',
  queuePath: 'myqueue',
})

export const someAction = ({ firebase }: { firebase: FirebaseProvider }) => {
  const path = 'some.remote.path'
  const signalPath = 'do.something'
  const onChildOptions: OnChildOptions = {
    // Merged with the payload passed on new data
    payload: {},
    // Read Firebase docs for these options
    endAt: 5,
    equalTo: 5,
    limitToFirst: 5,
    limitToLast: 4,
    orderByChild: 'name',
    orderByKey: true,
    orderByValue: true,
    startAt: 5,
  }
  const redirect = true
  const scopes = ['some', 'scopes']
  const putOptions: PutOptions<{ hello: string }> = {
    payload: { hello: 'avatar' },
    progress({ bytesTransferred, progress, state, totalBytes, hello }) {
      console.log(hello, progress)
    },
  }
  const email = 'some@email.com'
  const password = 'somepassword'
  const filename = 'filename.txt'
  const token = 'sometoken'
  const error = (err: any) => console.error(err)

  firebase.cancelOnDisconnect()
  firebase
    .createUserWithEmailAndPassword(email, password)
    .then(({ user }) => user.uid)
  firebase.deleteFile(path, filename).catch(error)
  firebase.deleteUser(password).catch(error)
  firebase.getUser().then(({ user }) => user.uid)
  firebase.linkWithFacebook({ redirect, scopes }).then(({ user }) => user.uid)
  firebase.linkWithGithub({ redirect }).then(({ user }) => user.uid)
  firebase.linkWithGoogle({ redirect }).then(({ user }) => user.uid)
  firebase.off(path)
  firebase.off(path, 'onChildAdded')
  firebase.onChildAdded(path, signalPath, onChildOptions)
  firebase.onChildAdded(path, signalPath)
  firebase.onChildChanged(path, signalPath, onChildOptions)
  firebase.onChildChanged(path, signalPath)
  firebase.onChildRemoved(path, signalPath, onChildOptions)
  firebase.onChildRemoved(path, signalPath)
  firebase.onValue(path, signalPath, { payload: { someRandom: 'value' } })
  firebase.onValue(path, signalPath)
  firebase
    .push(path, { name: 'child name', foo: 'bar' })
    .then(({ key }) => console.log(key))
  firebase
    .put(path, new File(['x', 'y'], filename), putOptions)
    .then(({ url, filename }) => console.log(url, filename))
  firebase.remove(path).catch(error)
  firebase.sendPasswordResetEmail(email).catch(error)
  firebase.set(path, { some: 'value' }).catch(error)
  firebase.setOnDisconnect('some.local.path', true)
  firebase.signInAnonymously().then(({ user }) => user.uid)
  firebase.signInWithCustomToken(token).then(({ user }) => user.uid)
  firebase
    .signInWithEmailAndPassword(email, password)
    .then(({ user }) => user.uid)
  firebase.signInWithFacebook({ redirect, scopes }).then(({ user }) => user.uid)
  firebase.signInWithGithub({ redirect }).then(({ user }) => user.uid)
  firebase.signInWithGoogle({ redirect }).then(({ user }) => user.uid)
  firebase.signOut()
  firebase.task('some.name', { some: 'payload' }).catch(error)
  firebase
    .transaction(path, (foo) => foo)
    .then(({ committed, value }) => console.log(committed, value))
  firebase.update('some.path', { email }).catch(error)
  firebase
    .value<{ name: string }>('some.remote')
    .then(({ value }) => console.log(value.name))
}
