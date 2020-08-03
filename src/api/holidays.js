import * as api from './api'

export function getHoliday({ holidayId }) {
  return api.get(`/holidays/${holidayId}`)
}

export function getUserLeaveYearHoliday(params) {
  return api.get('/holidays', params)
}

export function getUserLeaveYearToil(params) {
  return api.get('/holidays/toil', params)
}

export function getHolidays(params) {
  return api.get('/holidays', params)
}

// export function createHoliday({ holiday, token }) {
//   return api.post('/holidays', holiday, token)
// }
export function createHoliday(holiday) {
  return api.post('/holidays', holiday)
}

// export function updateHoliday({ holidayId, holiday, token }) {
//   return api.put(`/holidays/${holidayId}`, holiday, token)
// }
export function updateHoliday({ holidayId, holiday }) {
  return api.put(`/holidays/${holidayId}`, holiday)
}

// export function deleteHoliday({ holidayId, token }) {
//   return api.del(`/holidays/${holidayId}`, token)
// }
export function deleteHoliday(holidayId) {
  return api.del(`/holidays/${holidayId}`)
}