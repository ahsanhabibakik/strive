import common from './common.json'
import auth from './auth.json'
import dashboard from './dashboard.json'
import landing from './landing.json'
import errors from './errors.json'
import projects from './projects.json'
import tasks from './tasks.json'
import general from './general.json'
import navigation from './navigation.json'
import notifications from './notifications.json'

export const en = {
  common,
  auth,
  dashboard,
  landing,
  errors,
  projects,
  tasks,
  general,
  navigation,
  notifications,
}

export type TranslationKeys = typeof en
export type NestedKeyOf<T> = {
  [K in keyof T & (string | number)]: T[K] extends object
    ? `${K}.${NestedKeyOf<T[K]>}`
    : `${K}`
}[keyof T & (string | number)]

export default en