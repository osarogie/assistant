/* eslint no-extend-native: 0 */
import includes from 'core-js/library/fn/string/virtual/includes'
import repeat from 'core-js/library/fn/string/virtual/repeat'
import assign from 'core-js/library/fn/object/assign'

String.prototype.includes = includes
String.prototype.repeat = repeat
String.prototype.trim = function() {
  return this.replace(/^\s+|\s+$/g, '')
}
String.prototype.trimLeft = function() {
  return this.replace(/^\s+/, '')
}
String.prototype.trimRight = function() {
  return this.replace(/\s+$/, '')
}

Object.assign = assign
