import { ResolveValue, Tag } from 'function-tree'

type Action = any

type TagOr<T> = ResolveValue<T> | T

export interface OnChildOptions {
  endAt?: number
  equalTo?: number
  limitToFirst?: number
  limitToLast?: number
  orderByChild?: string
  orderByKey?: boolean
  orderByValue?: boolean
  payload?: any
  startAt?: number
}

export interface OnValueOptions {
  payload?: any
}

export interface PutOptions {
  payload?: any
  // state or signal
  progress?: Tag<string>
}

export interface TransformFunction {
  (currentData: any): any
}

export function cancelOnDisconnect(): Action
export function createUserWithEmailAndPassword(
  email: TagOr<string>,
  password: TagOr<string>
): Action
export function deleteFile(path: TagOr<string>, filename: TagOr<string>): Action
export function deleteUser(password: TagOr<string>): Action
export function getDownloadURL(path: TagOr<string>, file: any): Action
export function getUser(): Action
export function linkWithFacebook(
  options: { redirect?: TagOr<boolean>; scopes: TagOr<string[]> } & any
): Action
export function linkWithGithub(
  options: { redirect?: TagOr<boolean> } & any
): Action
export function linkWithGoogle(
  options: { redirect?: TagOr<boolean> } & any
): Action
export function off(path: TagOr<string>, event?: TagOr<string>): Action
export function onChildAdded(
  path: TagOr<string>,
  signal: Tag,
  opts?: TagOr<OnChildOptions>
): Action
export function onChildChanged(
  path: TagOr<string>,
  signal: Tag,
  opts?: TagOr<OnChildOptions>
): Action
export function onChildRemoved(
  path: TagOr<string>,
  signal: Tag,
  opts?: TagOr<OnChildOptions>
): Action
export function onValue(
  path: TagOr<string>,
  signal: Tag,
  opts?: TagOr<OnValueOptions>
): Action
export function push(path: TagOr<string>, child: any): Action
export function put(path: TagOr<string>, file: any, opts?: PutOptions): Action
export function remove(path: TagOr<string>): Action
export function sendPasswordResetEmail(email: TagOr<string>): Action
export function set(path: TagOr<string>, value: any): Action
export function setOnDisconnect(localPath: TagOr<string>, value: any): Action
export function signInAnonymously(): Action
export function signInWithCustomToken(token: TagOr<string>): Action
export function signInWithEmailAndPassword(
  email: TagOr<string>,
  password: TagOr<string>
): Action
export function signInWithFacebook(
  opts: { redirect?: TagOr<boolean>; scopes: TagOr<string[]> } & any
): Action
export function signInWithGithub(
  opts: { redirect?: TagOr<boolean> } & any
): Action
export function signInWithGoogle(
  opts: { redirect?: TagOr<boolean> } & any
): Action
export function signOut(): Action
export function task(taskName: TagOr<string>, payload: any): Action
export function transaction(
  path: TagOr<string>,
  transformer: TransformFunction
): Action
export function update(path: TagOr<string>, partial: any): Action
export function value(path: TagOr<string>): Action
