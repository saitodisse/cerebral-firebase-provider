import firebase from 'firebase'
import { FirebaseProviderError } from './errors'

export default function createTask(options) {
  return function(name, payload = {}) {
    return new Promise((resolve, reject) => {
      const tasksPath = options.queuePath
        ? options.queuePath + '/tasks'
        : 'queue/tasks'
      const ref = firebase.database().ref(tasksPath)

      return firebase
        .auth()
        .currentUser.getToken()
        .then((_token) => {
          const taskKey = ref.push(
            Object.assign(
              {
                _state: options.specPrefix
                  ? `${options.specPrefix}_${name}`
                  : name,
                _token,
              },
              options.sendTaskExecutionDetails
                ? {
                    _execution: {
                      id: this.context.execution.id,
                      functionIndex: this.functionDetails.functionIndex,
                    },
                  }
                : {},
              payload
            )
          )

          const taskRef = firebase.database().ref(`${tasksPath}/${taskKey.key}`)
          taskRef.on('value', (data) => {
            const val = data.val()

            if (!val) {
              taskRef.off()
              resolve()
            } else if (val._error_details) {
              taskRef.off()
              reject(new FirebaseProviderError(val._error_details))
            }
          })
        })
    })
  }
}
