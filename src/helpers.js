import firebase from 'firebase'
import { FirebaseProviderError } from './errors'
const refs = {}

export function createRef(path, options = {}) {
  if (path.indexOf('/') >= 0) {
    throw new FirebaseProviderError(
      new Error(
        'The path "' +
          path +
          '" is not valid. Use dot notation for consistency with Cerebral'
      )
    )
  }
  path = path.replace(/\./g, '/')
  return Object.keys(options).reduce((ref, key) => {
    switch (key) {
      case 'payload':
        return ref
      case 'asArray':
        return ref
      case 'orderByKey':
        return options[key] ? ref[key]() : ref
      case 'orderByValue':
        return options[key] ? ref[key]() : ref
      default:
        return ref[key](options[key])
    }
  }, firebase.database().ref(path))
}

export function createStorageRef(path) {
  if (path.indexOf('/') >= 0) {
    throw new FirebaseProviderError(
      new Error(
        'The path "' +
          path +
          '" is not valid. Use dot notation for consistency with Cerebral'
      )
    )
  }
  path = path.replace(/\./g, '/')
  return firebase.storage().ref(path)
}

export function listenTo(ref, path, event, signal, cb) {
  refs[path] = refs[path] || {}
  refs[path][event] = refs[path][event] ? refs[path][event].concat(ref) : [ref]

  ref.on(event, cb, (error) => {
    throw new FirebaseProviderError(
      new Error(
        event +
          ' listener to path ' +
          path +
          ', triggering signal: ' +
          signal +
          ', gave error: ' +
          error.message
      )
    )
  })
}

const events = {
  onChildAdded: 'child_added',
  onChildChanged: 'child_changed',
  onChildRemoved: 'child_removed',
  onValue: 'value',
  '*': '*',
}

export function stopListening(passedPath, event) {
  const realEventName = events[event] || '*'
  const pathArray = passedPath.split('.')
  let path = passedPath
  let isWildcardPath = false

  if (event && !realEventName) {
    throw new FirebaseProviderError(
      new Error(
        'The event "' +
          event +
          '" is not a valid event. Use: "' +
          Object.keys(events)
      )
    )
  }

  if (pathArray[pathArray.length - 1] === '*') {
    isWildcardPath = true
    pathArray.pop()
    path = pathArray.join('.')
  }

  let refsHit
  if (isWildcardPath) {
    refsHit = Object.keys(refs).reduce((currentKeysHit, refPath) => {
      if (refPath.indexOf(path) === 0) {
        return currentKeysHit.concat(refPath)
      }

      return currentKeysHit
    }, [])
  } else {
    refsHit = refs[path] ? [path] : []
  }

  if (!refsHit.length) {
    throw new FirebaseProviderError(
      new Error('The path "' + path + '" has no listeners')
    )
  }

  refsHit.forEach((refPath) => {
    const ref = refs[refPath]
    if (realEventName === '*') {
      Object.keys(ref).forEach((eventName) => {
        ref[eventName].forEach((listener) => listener.off())
        delete ref[eventName]
      })
    } else {
      if (!ref[realEventName]) {
        throw new FirebaseProviderError(
          new Error(
            'The path"' +
              path +
              '" has no listeners for "' +
              realEventName +
              '"'
          )
        )
      }
      ref[realEventName].forEach((listener) => listener.off())
      delete ref[realEventName]
    }

    if (Object.keys(ref).length === 0) {
      delete refs[refPath]
    }
  })
}

export function createUser(user) {
  return {
    uid: user.uid,
    isAnonymous: user.isAnonymous,
    providerData: user.providerData,
    displayName: user.displayName,
    email: user.email,
    emailVerified: user.emailVerified,
    photoURL: user.photoURL,
  }
}

export function createReturnPromise(returnPromise, path) {
  let promise = returnPromise

  if (!path) {
    promise = promise
      .then((response) => (response ? { response } : {}))
      .catch((error) => ({ error }))
  }

  if (path && path.success) {
    promise = promise.then(
      (response) => (response ? path.success({ response }) : path.success())
    )
  }
  if (path && path.error) {
    promise = promise.catch((error) => {
      return path.error({ error })
    })
  }

  return promise
}

export function noop() {}

export function snapshotToArray(snapshot) {
  const result = []

  snapshot.forEach((childSnapshot) => {
    result.push({
      key: childSnapshot.key,
      value: childSnapshot.val(),
    })
  })

  return result
}
