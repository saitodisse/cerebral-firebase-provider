# @cerebral/firebase

## Install

**NPM**

`npm install @cerebral/firebase`

## Description

The Firebase provider is a Cerebral friendly wrapper around the Firebase client. By default the Firebase client is heavily event based, even just getting some value, handling authentication etc. This is useful in some types of apps, but Cerebral has a very straight forward way of thinking about side effects. You will find that a lot of the API exposed by the Firebase client is simplified!

## Instantiate

```javascript
import {Controller} from 'cerebral'
import FirebaseProvider from '@cerebral/firebase'

const controller = Controller({
  providers: [
    FirebaseProvider({
      config: {
        apiKey: '{apiKey}',
        authDomain: '{authDomain}',
        databaseURL: '{databaseURL}',
        storageBucket: '{storageBucket}'
      },
      // Tasks related options:
      // Prefix the specs triggered. This is useful in
      // development when multiple developers are working
      // on the same instance.
      specPrefix: 'CJ',
      // Use a different queue path.
      queuePath: 'myqueue' // default = 'queue',
      // Set to true if you are using debugger cross client
      // and server
      sendTaskExecutionDetails: false
    })
  ]
})
```

**Important notes**

* The Cerebral firebase provider uses **dot** notation to keep consistency with Cerebral itself

* All factories supports template tags, allowing you to dynamically create paths and points to values

## cancelOnDisconnect

Cancel setting a value when Firebase detects disconnect.

### action

```js
function someAction({ firebase, state }) {
  firebase.cancelOnDisconnect()
}
```

### operator

```javascript
import { state } from 'cerebral/tags'
import { cancelOnDisconnect } from '@cerebral/firebase/operators'

export default [cancelOnDisconnect()]
```

## createUserWithEmailAndPassword

Register a new user with email and password.

### action

```js
function someAction({ firebase, state }) {
  const email = state.get('register.email')
  const password = state.get('register.password')

  return firebase
    .createUserWithEmailAndPassword(email, password)
    .then((response) => {
      /*
        user: { uid: 'someuid', ... }
      */
    })
}
```

### operator

```javascript
import { state } from 'cerebral/tags'
import { createUserWithEmailAndPassword } from '@cerebral/firebase/operators'

export default [
  createUserWithEmailAndPassword(state`newUser.email`, state`newUser.password`)
  /*
                    PROPS: {
                      response: { user: {} }
                    }
                  */
]
```

### operator with paths

```javascript
import { state } from 'cerebral/tags'
import { createUserWithEmailAndPassword } from '@cerebral/firebase/operators'

export default [
  createUserWithEmailAndPassword(state`newUser.email`, state`newUser.password`),
  {
    success: [
      /* PROPS: { response: {...} } */
    ],
    error: [
      /* PROPS: { error: {...} } */
    ]
  }
]
```

## deleteFile

Use `deleteFile` to remove an uploaded file. Specify the containing folder and filename.

### action

```js
function someAction({ firebase, props }) {
  return firebase.deleteFile('folderName', props.fileName).then(() => {
    // No output
  })
}
```

### operator

```js
import { props, state, string } from 'cerebral/tags'
import { deleteFile } from '@cerebral/firebase/operators'

export default [
  deleteFile(
    string`posts.all.${props`postId`}`,
    state`posts.all.${props`postId`}.imageName`
  ),
  // No output

  // Alternatively with explicit paths
  deleteFile(
    string`posts.all.${props`postId`}`,
    state`posts.all.${props`postId`}.imageName`
  ),
  {
    success: [],
    error: []
  }
]
```

### operator with paths

```js
import { props, state, string } from 'cerebral/tags'
import { deleteFile } from '@cerebral/firebase/operators'

export default [
  deleteFile(
    string`posts.all.${props`postId`}`,
    state`posts.all.${props`postId`}.imageName`
  ),
  {
    success: [
      // No output
    ],
    error: [
      /* PROPS: { error: {...} } */
    ]
  }
]
```

## error

The Firebase errors are passed to signal and global catch handlers, or `.catch` handler in your actions.

### FirebaseProviderError (base)

```js
import {FirebaseProviderError} from '@cerebral/firebase'

// Error structure
{
  name: 'HttpProviderError',
  message: 'Some firebase error message'
  stack: '...'  
}
```

### FirebaseProviderAuthenticationError

```js
import {FirebaseProviderAuthenticationError} from '@cerebral/firebase'

// Error structure
{
  name: 'HttpProviderError',
  message: 'Some firebase error message'
  code: 10 // firebase auth error code
  stack: '...'  
}
```

## getDownloadURL

Will get the download url of a given file in firebase storage.

### action

```js
function someAction({ firebase, props }) {
  return firebase
    .getDownloadURL('images', `${props.path}.jpg`)
    .then((response) => {
      /*
        response: https://foo.com/myImage.jpg
      */
    })
}
```

### operator

```javascript
import { getDownloadURL } from '@cerebral/firebase/operators'

export default [
  getDownloadURL('images', string`${props`path`}.jpg`),
  {
    success: [
      /* PROPS: { response: https://foo.com/myImage.jpg } */
    ],
    error: [
      /* PROPS: { error: { ... } } */
    ]
  }
]
```

## getUser

Will resolve to `{user: {}}` if user exists. If user was redirected from Facebook/Google etc. as part of first sign in, this method will handle the confirmed registration of the user.

### action

```js
function someAction({ firebase }) {
  return firebase.getUser().then((response) => {
    /*
        user: {...},
        isRedirected: false
      */
  })
}
```

### operator

```javascript
import { getUser } from '@cerebral/firebase/operators'

export default [
  getUser()
  /*
                    PROPS: {
                      response: {...}
                    }
                  */
]
```

### operator with paths

```javascript
import { getUser } from '@cerebral/firebase/operators'

export default [
  getUser(),
  {
    success: [
      /* PROPS: { response: {...} } */
    ],
    error: [
      /* PROPS: { error: {...} } */
    ]
  }
]
```

## linkWith{PROVIDER}

Link an anonymous account with Facebook, Google or Github.

### action

```js
function someAction({ firebase, state }) {
  return firebase
    .linkWithFacebook({
      redirect: false, // Use popup or redirect. Redirect typically for mobile
      scopes: [] // Facebook scopes to access
    })
    .then((response) => {
      /*
        name: 'Bob',
        ...
      */
    })
}
```

### operator

```javascript
import { state } from 'cerebral/tags'
import { linkWithFacebook } from '@cerebral/firebase/operators'

export default [
  linkWithFacebook({
    redirect: state`useragent.media.small`
  })
  /*
                    PROPS: {
                      response: {...}
                    }
                  */
]
```

### operator with paths

```javascript
import { state } from 'cerebral/tags'
import { linkWithFacebook } from '@cerebral/firebase/operators'

export default [
  linkWithFacebook({
    redirect: state`useragent.media.small`
  }),
  {
    success: [
      /* PROPS: { response: {...} } */
    ],
    error: [
      /* PROPS: { error: {...} } */
    ]
  }
]
```

Similar you can sign in with Google or GitHub.
Just use `linkWithGoogle` or `linkWithGithub` instead of `linkWithFacebook`.

## off

### action

```js
function someAction({ firebase }) {
  // Turn off listener at specific path and
  // specific event
  firebase.off('posts', 'onChildChanged')

  // Turn off all listeners at specific path
  firebase.off('posts')

  // Turn off all listeners of specific event at wildcard path
  firebase.off('posts.*', 'onChildChanged')

  // Turn off all listeners at wildcard path
  firebase.off('posts.*')
}
```

### operator

```javascript
import { string } from 'cerebral/tags'
import { off } from '@cerebral/firebase/operators'

export default [
  // Same API as in actions, also wildcard
  off('posts', 'onChildChanged'),

  // Compose using string tag
  off(string`posts.${state`selectedPostKey`}`)
]
```

## onChildAdded

### action

```js
function someAction({ firebase }) {
  firebase.onChildAdded('posts', 'posts.postAdded', {
    // Merged with the payload passed on new data
    payload: {},
    // Read Firebase docs for these options
    endAt: 5,
    equalTo: 5,
    limitToFirst: 5,
    limitToLast: 5,
    orderByChild: 'count',
    orderByKey: true,
    orderByValue: true,
    startAt: 5
  })
  // posts.postAdded called with { key, value, ...payload }
}
```

This will immediately grab and trigger the signal `posts.postAdded` for every post grabbed. Note this is just registering a listener, not returning a value from the action. The signal is triggered with the payload: `{ key: 'someKey', value: {} }`.

To stop listening for updates to the posts:

```js
function someAction({ firebase }) {
  firebase.off('posts', 'onChildAdded')
}
```

### operator

```javascript
import { state, string, signal } from 'cerebral/tags'
import { onChildAdded } from '@cerebral/firebase/operators'

export default [
  onChildAdded(string`foo.bar`, signal`some.signal`, {
    orderByChild: 'count',
    limitToFirst: state`config.limitToFirst`
  })
]
```

## onChildChanged

### action

```js
function someAction({ firebase }) {
  firebase.onChildChanged('posts', 'posts.postChanged', {
    // Same options as above
  })
  // posts.postChanged called with { key, value, ...payload }
}
```

This will trigger the signal `posts.postChanged` whenever a post is changed in the selection. The signal is triggered with the payload: `{ key: 'someKey', value: {} }`.

To stop listening:

```js
function someAction({ firebase }) {
  firebase.off('posts', 'onChildChanged')
}
```

### operator

```javascript
import { onChildChanged } from '@cerebral/firebase/operators'
import { string, signal } from 'cerebral/tags'

export default [
  onChildChanged(string`foo.bar`, signal`some.signal`, {
    // Same options as above
  })
]
```

## onChildRemoved

### action

```js
function someAction({ firebase }) {
  firebase.onChildRemoved('posts', 'posts.postRemoved', {
    // Same options as above
  })
  // posts.postRemoved called with { key, ...payload }
}
```

This will trigger the signal `posts.postRemoved` whenever a post is removed from the selection. The signal is triggered with the payload: `{ key: 'someKey' }`.

To stop listening:

```js
function someAction({ firebase }) {
  firebase.off('posts', 'onChildRemoved')
}
```

### operator

```javascript
import { onChildRemoved } from '@cerebral/firebase/operators'
import { string, signal } from 'cerebral/tags'

export default [
  onChildRemoved(string`foo.bar`, signal`some.signal`, {
    // Same options as above
  })
]
```

## onValue

### action

```js
function someAction({ firebase }) {
  firebase.onValue('someKey.foo', 'someModule.fooUpdated', {
    payload: {} // Merged with the payload passed on new data
  })
  // someModule.fooUpdate called with { value, ...payload }
}
```

This will **NOT** immediately grab the value and trigger the signal passed, the first event is discarded for more predictable behaviour. To grab existing value, just use `value`.

To stop listening for updates to the value:

```js
function someAction({ firebase }) {
  firebase.off('someKey.foo', 'onValue')
}
```

### operator

```javascript
import { onValue } from '@cerebral/firebase/operators'
import { string, signal } from 'cerebral/tags'

export default [onValue(string`foo.bar`, signal`some.signal`)]
```

## push

Generates a new child location using a unique key and returns its reference from the action. An example being `{key: "-KWKImT_t3SLmkJ4s3-w"}`.

### action

```javascript
function someAction({ firebase }) {
  return firebase
    .push('users', {
      name: 'Bob'
    })
    .then((response) => {
      /*
        {
          key: 'someKey'
        }
      */
    })
}
```

### operator

```javascript
import { state } from 'cerebral/tags'
import { push } from '@cerebral/firebase/operators'

export default [
  push('users', state`newUser`)
  /*
                    PROPS: {
                      response: {...}
                    }
                  */
]
```

### operator with paths

```javascript
import { state } from 'cerebral/tags'
import { push } from '@cerebral/firebase/operators'

export default [
  push('users', state`newUser`),
  {
    success: [
      /* PROPS: { response: {...} } */
    ],
    error: [
      /* PROPS: { error: {...} } */
    ]
  }
]
```

_output_

```javascript
{
  key: 'theAddedKey'
}
```

## put

Upload a new file at the given location. Please note that the file is **not** stored inside the realtime database but into Google Cloud Storage (please consult filrebase documentation). This means that you need to take care of storage security as well.

Note that `put` expects a folder as first argument and will use the name of the provided file. If you want to control the filename, add this in the options. In this case, make sure to respect file type and extension...

### action

```js
function someAction({ firebase, props }) {
  return firebase.put('folderName', props.file, {
    progress({progress, bytesTransferred, totalBytes, state}) {
      /* do whatever */
    },
    // Override name, make sure you set same extension
    filename: 'customName.png'
    // optional payload added to progress callback
    { type: 'avatar'
    }
  })
    .then((response) => {
      /*
        {
          url: 'urlToFile',
          filename: 'nameOfFile'
          ... payload
        }
      */
    })
}
```

### operator

```js
import {props, signal, string, state} from 'cerebral/tags'
import {put} from '@cerebral/firebase/operators'

// we expect props.file to contain a file provided by
// a user in an <input type='file' />
export default [
  put(string`posts.all.${props`postId`}`, props`file`, {
    // Trigger a signal which receives payload
    progress: signal`gallery.progress`
    // Set progress on a state value
    progress: state`gallery.progress`
  }),
  /*
    PROPS: {
      response: {...}
    }
  */
]
```

### operator with paths

```js
import {props, signal, string, state} from 'cerebral/tags'
import {put} from '@cerebral/firebase/operators'

// we expect props.file to contain a file provided by
// a user in an <input type='file' />
export default [
  put(string`posts.all.${props`postId`}`, props`file`, {
    progress: signal`gallery.progress`
    progress: state`gallery.progress`
  }), {
    success: [
      /* PROPS: { response: {...} } */
    ],
    error: [
      /* PROPS: { error: {...} } */
    ]
  }
]
```

## remove

Remove the data at this database location.

### action

```javascript
function someAction({ firebase }) {
  return firebase.remove('foo.bar').then(() => {
    // No output
  })
}
```

### operator

```javascript
import { props, string } from 'cerebral/tags'
import { remove } from '@cerebral/firebase/operators'

export default [
  remove(string`users.${props`userKey`}`)
  // No output
]
```

### operator with paths

```javascript
import { props, string } from 'cerebral/tags'
import { remove } from '@cerebral/firebase/operators'

export default [
  remove(string`users.${props`userKey`}`),
  {
    success: [
      // No output
    ],
    error: [
      /* PROPS: { error: {...} } */
    ]
  }
]
```

## sendPasswordResetEmail

### action

```js
function someAction({ firebase, state }) {
  return firebase.sendPasswordResetEmail(state.get('user.email')).then(() => {
    // No output
  })
}
```

### operator

```javascript
import { state } from 'cerebral/tags'
import { sendPasswordResetEmail } from '@cerebral/firebase/operators'

export default [
  sendPasswordResetEmail(state`user.email`)
  // No output
]
```

### operator with paths

```javascript
import { state } from 'cerebral/tags'
import { sendPasswordResetEmail } from '@cerebral/firebase/operators'

export default [
  sendPasswordResetEmail(state`user.email`),
  {
    success: [
      // No output
    ],
    error: [
      /* PROPS: { error: {...} } */
    ]
  }
]
```

## set

Write data to this database location. This will overwrite any data at this location and all child locations. Passing **null** for the new value is equivalent to calling remove(); all data at this location or any child location will be deleted.

### action

```javascript
function someAction({ firebase }) {
  return firebase.set('foo.bar', 'baz').then(() => {
    // No output
  })
}
```

### operator

```javascript
import { props } from 'cerebral/tags'
import { set } from '@cerebral/firebase/operators'

export default [
  set('foo.bar', props`foo`)
  // No output
]
```

### operator with paths

```javascript
import { props } from 'cerebral/tags'
import { set } from '@cerebral/firebase/operators'

export default [
  set('foo.bar', props`foo`),
  {
    success: [
      // No output
    ],
    error: [
      /* PROPS: { error: {...} } */
    ]
  }
]
```

## setOnDisconnect

Sets a value when Firebase detects user has disconnected.

### action

```js
function someAction({ firebase, state }) {
  firebase.setOnDisconnect(
    `activeUsers.${state.get('app.user.uid')}`,
    'someValue'
  )
}
```

### operator

```javascript
import { state } from 'cerebral/tags'
import { setOnDisconnect } from '@cerebral/firebase/operators'

export default [
  setOnDisconnect(string`activeUsers.${state`app.user.uid`}`, null)
]
```

## signInAnonymously

This login will method will resolve to existing anonymous or create a new one for you.

### action

```js
function someAction({ firebase }) {
  return firebase.signInAnonymously().then((user) => {
    /*
        name: 'Bob',
        ...
      */
  })
}
```

### operator

```javascript
import { signInAnonymously } from '@cerebral/firebase/operators'

export default [
  signInAnonymously()
  /*
                    PROPS: {
                      response: {...}
                    }
                  */
]
```

### operator with paths

```javascript
import { signInAnonymously } from '@cerebral/firebase/operators'

export default [
  signInAnonymously(),
  {
    success: [
      /* PROPS: { response: {...} } */
    ],
    error: [
      /* PROPS: { error: {...} } */
    ]
  }
]
```

## signInWithCustomToken

Sign in a custom token.

_action_

```js
function someAction({ firebase, state }) {
  return firebase.signInWithCustomToken(state.get('token'))
}
```

_factory_

```javascript
import { props, state } from 'cerebral/tags'
import { signInWithCustomToken } from '@cerebral/firebase/operators'

export default [
  signInWithCustomToken(props`token`),

  // Alternatively with explicit paths
  signInWithCustomToken(state`token`),
  {
    success: [],
    error: []
  }
]
```

_output_

```javascript
{
  user: {
  }
}
```

## signInWithEmailAndPassword

Sign in a user with email and password.

### action

```js
function someAction({ firebase, state }) {
  const email = state.get('register.email')
  const password = state.get('register.password')

  return firebase
    .signInWithEmailAndPassword(email, password)
    .then((response) => {
      /*
        name: 'Bob',
        ...
      */
    })
}
```

### operator

```javascript
import { props } from 'cerebral/tags'
import { signInWithEmailAndPassword } from '@cerebral/firebase/operators'

export default [
  signInWithEmailAndPassword(props`email`, props`password`)
  /*
                    PROPS: {
                      response: {...}
                    }
                  */
]
```

### operator with paths

```javascript
import { props } from 'cerebral/tags'
import { signInWithEmailAndPassword } from '@cerebral/firebase/operators'

export default [
  signInWithEmailAndPassword(props`email`, props`password`),
  {
    success: [
      /* PROPS: { response: {...} } */
    ],
    error: [
      /* PROPS: { error: {...} } */
    ]
  }
]
```

## signInWith{PROVIDER}

Sign in a user with Facebook, Google or Github.

### action

```js
function someAction({ firebase, state }) {
  return firebase
    .signInWithFacebook({
      redirect: false, // Use popup or redirect. Redirect typically for mobile
      scopes: [] // Facebook scopes to access
    })
    .then((response) => {
      /*
        name: 'Bob',
        ...
      */
    })
}
```

### operator

```javascript
import { state } from 'cerebral/tags'
import { signInWithFacebook } from '@cerebral/firebase/operators'

export default [
  signInWithFacebook({
    redirect: state`useragent.media.small`
  })
  /*
                    PROPS: {
                      response: {...}
                    }
                  */
]
```

### operator with paths

```javascript
import { state } from 'cerebral/tags'
import { signInWithFacebook } from '@cerebral/firebase/operators'

export default [
  signInWithFacebook({
    redirect: state`useragent.media.small`
  }),
  {
    success: [
      /* PROPS: { response: {...} } */
    ],
    error: [
      /* PROPS: { error: {...} } */
    ]
  }
]
```

Similar you can sign in with Google or GitHub.
Just use `signInWithGoogle` or `signInWithGithub` instead of `signInWithFacebook`.

## signOut

Sign out user. **getUser** will now not resolve a user anymore.

### action

```js
function someAction({ firebase }) {
  return firebase.signOut().then(() => {
    // No output
  })
}
```

### operator

```javascript
import { signOut } from '@cerebral/firebase/operators'

export default [
  signOut()
  // No output
]
```

### operator with paths

```javascript
import { signOut } from '@cerebral/firebase/operators'

export default [
  signOut(),
  {
    success: [
      // No output
    ],
    error: [
      /* PROPS: { error: {...} } */
    ]
  }
]
```

## task

If you are using the [firebase-queue](https://github.com/firebase/firebase-queue) and need to create tasks, you can do that with:

### action

```js
function someAction({ firebase, state }) {
  return firebase
    .task('create_post', {
      uid: state.get('app.user.uid'),
      text: state.get('posts.newPostText')
    })
    .then(() => {
      // No output
    })
}
```

This will add a task at `queue/tasks`. There is no output from a resolved task, it just resolves when the action has been processed.

### operator

```javascript
import { state, props } from 'cerebral/tags'
import { task } from '@cerebral/firebase/operators'

export default [
  task('some_task', {
    uid: state`user.uid`,
    data: props`data`
  }),
  // No output

  // Alternatively with explicit paths
  task('some_task', {
    uid: state`user.uid`,
    data: props`data`
  }),
  {
    success: [],
    error: []
  }
]
```

### operator with paths

```javascript
import { state, props } from 'cerebral/tags'
import { task } from '@cerebral/firebase/operators'

export default [
  task('some_task', {
    uid: state`user.uid`,
    data: props`data`
  }),
  {
    success: [
      // No output
    ],
    error: [
      // No output
    ]
  }
]
```

## transaction

Atomically modifies the data at the provided location.

Unlike a normal set(), which just overwrites the data regardless of its previous value, transaction() is used to modify the existing value to a new value, ensuring there are no conflicts with other clients writing to the same location at the same time.

To accomplish this, you pass transaction() an update function which is used to transform the current value into a new value. If another client writes to the location before your new value is successfully written, your update function will be called again with the new current value, and the write will be retried. This will happen repeatedly until your write succeeds without conflict or you abort the transaction by not returning a value from your update function.

### action

```javascript
function someAction({ firebase }) {
  function transactionFunction(currentData) {
    if (currentData === null) {
      return { foo: 'bar' }
    }

    return // Abort the transaction.
  }

  return firebase
    .transaction('some.transaction.path', transactionFunction)
    .then((result) => {
      if (result.committed) {
        return { result: result.value }
      } else {
        throw new Error('Transaction failed')
      }
    })
    .then((response) => {
      /*
          {
            committed: true,
            value: 'new value'
          }
        */
    })
}
```

This will add a task at `queue/tasks`. There is no output from a resolved task, it just resolves when the action has been processed.

### operator

```javascript
import {transaction} from '@cerebral/firebase/operators'

function transactionFunction() {...}

export default [
  transaction('foo.bar', transactionFunction),
  /*
    PROPS: {
      response: {...}
    }
  */
]
```

### operator with paths

```javascript
import {transaction} from '@cerebral/firebase/operators'

function transactionFunction() {...}

export default [
  transaction('foo.bar', transactionFunction), {
    success: [
      /* PROPS: { response: {...} } */
    ],
    error: [
      // No output
    ]
  }
]
```

Note: Modifying data with set() will cancel any pending transactions at that location, so extreme care should be taken if mixing set() and transaction() to update the same data.

Note: When using transactions with Security and Firebase Rules in place, be aware that a client needs .read access in addition to .write access in order to perform a transaction. This is because the client-side nature of transactions requires the client to read the data in order to transactionally update it.

## update

As opposed to the set() method, update() can be use to selectively update only the referenced properties at the current location (instead of replacing all the child properties at the current location).

### action

```javascript
function someAction({ firebase }) {
  return firebase
    .update('some.path', {
      foo: 'bar',
      'items.item1.isAwesome': true
    })
    .then(() => {
      // No output
    })
}
```

### operator

```javascript
import { props } from 'cerebral/tags'
import { update } from '@cerebral/firebase/operators'

export default [
  update('some.path', {
    'foo.bar': props`bar`,
    'foo.baz': props`baz`
  }),
  // No output

  // Alternatively with explicit paths
  update('some.path', {
    'foo.bar': props`bar`,
    'foo.baz': props`baz`
  }),
  {
    success: [],
    error: []
  }
]
```

### operator with paths

```javascript
import { props } from 'cerebral/tags'
import { update } from '@cerebral/firebase/operators'

export default [
  update('some.path', {
    'foo.bar': props`bar`,
    'foo.baz': props`baz`
  }),
  {
    success: [
      // No output
    ],
    error: [
      /* PROPS: { error: {...} } */
    ]
  }
]
```

## value

### action

```js
function someAction({ firebase }) {
  return firebase.value('someKey.foo').then((response) => {
    /*
        {
          key: 'foo',
          value: 'some value'
        }
      */
  })
}
```

### operator

```javascript
import { value } from '@cerebral/firebase/operators'
import { state } from 'cerebral/tags'

export default [
  value('foo.bar'),
  /*
                    PROPS: {
                      response: {...}
                    }
                  */
  // Alternatively with explicit paths
  value('foo.bar'),
  {
    success: [],
    error: []
  }
]
```

### operator with paths

```javascript
import { value } from '@cerebral/firebase/operators'

export default [
  value('foo.bar'),
  {
    success: [
      /* PROPS: { response: {...} } */
    ],
    error: [
      /* PROPS: { error: {...} } */
    ]
  }
]
```
