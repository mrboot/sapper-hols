import * as api from './api'

export function getEntitlement({ entitlementId }) {
  return api.get(`/entitlements/${entitlementId}`)
}

export function getUserLeaveYearEntitlement(params) {
  return api.get('/entitlements', params)
}

export function getEntitlements(params) {
  return api.get('/entitlements', params)
}

// export function createEntitlement({ entitlement, token }) {
//   return api.post('/entitlements', entitlement, token)
// }

export function createEntitlement(entitlement) {
  return api.post('/entitlements', entitlement)
}

export function updateEntitlement({ entitlementId, entitlement, token }) {
  return api.put(`/entitlements/${entitlementId}`, entitlement, token)
}

export function deleteEntitlement({ entitlementId, token }) {
  return api.del(`/entitlements/${entitlementId}`, token)
}