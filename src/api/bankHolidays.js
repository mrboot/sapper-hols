import * as api from './api'

export function searchBankHolidays(params) {
  return api.get('/bank-holidays/search', params)
}