import common from './common.json'
import auth from './auth.json'
import dashboard from './dashboard.json'
import landing from './landing.json'
import errors from './errors.json'
import goals from './goals.json'
import habits from './habits.json'
import navigation from './navigation.json'
import notifications from './notifications.json'

export const en = {
  common,
  auth,
  dashboard,
  landing,
  errors,
  goals,
  habits,
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