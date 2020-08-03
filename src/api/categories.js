import * as api from './api'

export function getCategory({ categoryId }) {
  return api.get(`/categories/${categoryId}`)
}

export function getCategories(params) {
  return api.get('/categories', params)
}

export function createCategory({ category, token }) {
  return api.post('/categories', category, token)
}

export function updateCategory({ categoryId, category, token }) {
  return api.put(`/categories/${categoryId}`, category, token)
}

export function deleteCategory({ categoryId, token }) {
  return api.del(`/categories/${categoryId}`, token)
}