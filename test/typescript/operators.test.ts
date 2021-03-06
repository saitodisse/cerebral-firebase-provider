import { Sequence } from 'cerebral'
import { props, signal, state, string } from 'cerebral/tags'
import * as firebase from '../../operators'

const onChildOptions: firebase.OnChildOptions = {
  // Merged with the payload passed on new data
  payload: {},
  // Read Firebase docs for these options
  endAt: 5,
  equalTo: 5,
  limitToFirst: 4,
  limitToLast: 10,
  orderByChild: 'name',
  orderByKey: true,
  orderByValue: true,
  startAt: 5,
}

const onValueOptions: firebase.OnValueOptions = {
  // Merged with the payload passed on new data
  payload: {},
}

const putOptions: firebase.PutOptions = {
  payload: { type: 'avatar' },
  progress: signal`do.this`,
}

export const sequence: Sequence = [
  firebase.cancelOnDisconnect(),
  firebase.createUserWithEmailAndPassword(
    state`some.email`,
    state`some.password`
  ),
  firebase.deleteFile(props`some.path`, 'photo.jpg'),
  firebase.deleteUser(state`forms.auth.password`),
  firebase.getUser(),
  firebase.linkWithFacebook({ redirect: true, scopes: ['scope'] }),
  firebase.linkWithGithub({ redirect: true }),
  firebase.linkWithGoogle({ redirect: false }),
  firebase.off('some.path', 'onChildAdded'),
  firebase.off('some.path'),
  firebase.onChildAdded(props`foo.bar`, signal`some.signal`, onChildOptions),
  firebase.onChildAdded(props`foo.bar`, signal`some.signal`),
  firebase.onChildChanged(
    'some.fixed.path',
    signal`some.signal`,
    onChildOptions
  ),
  firebase.onChildChanged('some.fixed.path', signal`some.signal`),
  firebase.onChildRemoved(
    props`some.dynamic.path`,
    signal`some.signal`,
    onChildOptions
  ),
  firebase.onChildRemoved(props`some.dynamic.path`, signal`some.signal`),
  firebase.onValue('some.path', signal`some.signal`, onValueOptions),
  firebase.onValue('some.path', signal`some.signal`),
  firebase.push('some.remote.path', props`newChild`),
  firebase.put('some.remote', new File([''], 'some.txt'), putOptions),
  firebase.remove('some.place'),
  firebase.sendPasswordResetEmail(props`email`),
  firebase.set(string`users.${state`user.uid`}.email`, props`email`),
  firebase.setOnDisconnect(state`user.disconnected`, true),
  firebase.signInAnonymously(),
  firebase.signInWithCustomToken(props`foo`),
  firebase.signInWithEmailAndPassword(props`email`, props`password`),
  firebase.signInWithFacebook({
    redirect: false,
    scopes: ['some', 'scopes'],
    someRandomOption: true,
  }),
  firebase.signInWithGithub({ redirect: false, someRandomOption: true }),
  firebase.signInWithGoogle({ redirect: false, someRandomOption: true }),
  firebase.signOut(),
  firebase.task('doThis', { foo: 'bar' }),
  firebase.transaction('some.path', (data) => data),
  firebase.update('some.remote.path', { email: 'foo@bar.baz' }),
  firebase.value('some.remote.path'),
]
