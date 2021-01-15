import { writable, derived } from 'svelte/store'
import compareAsc from 'date-fns/compareAsc'
import * as api from '../api'

export let dbLeaveYear = writable('')
export let categories = writable([])
export let holColours = writable({})
export let tableData = writable([])
export let leaveRemaining = writable(0)
export let leaveTaken = writable(0)
export let entitlementHours = writable(0)
export let carriedOver = writable(0)
export let toilRemaining = writable(0)
export let user = writable('')

export let formData = writable({
  itemIndex: undefined,
  id: undefined,
  description: '',
  startDate: '',
  endDate: '',
  category: 'Holiday',
  duration: 0,
  leaveYear: ''
})

export function setUser() {
  // TODO get this pulling from a variable and then the login in full course
  user.set(1)
}

export function getCurrentLeaveYear() {
  const today = new Date()
  const currYear = today.getFullYear()
  const twoDigitYear = currYear.toString().slice(-2)
  const cutoffDate = `${currYear}-04-01`
  const result = compareAsc(today, new Date(cutoffDate))
  if (result === -1) {
    dbLeaveYear.set(`${parseInt(twoDigitYear, 10) - 1}${twoDigitYear}`)
  } else {
    dbLeaveYear.set(`${twoDigitYear}${parseInt(twoDigitYear, 10) + 1}`)
  }
}

export function setLeaveYear(direction, leaveYear) {
  let fromYear =
    direction === 'up' ?
      parseInt(leaveYear.slice(0, 2)) + 1 :
      parseInt(leaveYear.slice(0, 2)) - 1
  let toYear =
    direction === 'up' ?
      parseInt(leaveYear.slice(-2)) + 1 :
      parseInt(leaveYear.slice(-2)) - 1
  dbLeaveYear.set(`${fromYear}${toYear}`)
}

export const displayLeaveYear = derived(
  dbLeaveYear,
  $dbLeaveYear => `${$dbLeaveYear.slice(0, 2)}/${$dbLeaveYear.slice(-2)}`
)

async function getLeaveData(userId, leaveYear) {
  let entitlement = await getEntitlementData(userId, leaveYear)
  if (entitlement.length === 0) {
    entitlement = await setEntitlement(userId, leaveYear)
  }
  const base = entitlement[0].base
  const carried = entitlement[0].carried
  const holidays = await getLeaveDataFromDb(userId, leaveYear)
  const taken = await getLeaveTaken(holidays)
  const remaining = getLeaveRemaining(base, carried, taken)
  return { entitlement, holidays, taken, remaining }
}

async function getEntitlementData(userId, leaveYear) {
  const entitlement = await api.entitlements.getUserLeaveYearEntitlement({ user: userId, leaveYear })
  return entitlement
}

async function setEntitlement(userId, leaveYear, base = 200, carried = 0) {
  const entitlementData = {
    user: userId,
    leaveYear,
    base,
    carried,
  }
  await api.entitlements.createEntitlement(entitlementData)
  const entitlement = await getEntitlementData(userId, leaveYear)
  return entitlement
}

export async function setHolidayDisplayData(userId, leaveYear) {
  const { entitlement, holidays, taken, remaining } = await getLeaveData(
    userId,
    leaveYear
  )
  const toilBalance = await setToilBalance(userId)
  toilRemaining.set(toilBalance)
  entitlementHours.set(entitlement[0].base)
  carriedOver.set(entitlement[0].carried)
  tableData.set(holidays)
  leaveTaken.set(taken)
  leaveRemaining.set(remaining)
}

function getLeaveTaken(data) {
  const totalLeave = data
    .filter(entry => {
      return entry.category === 'Holiday'
    })
    .reduce((prev, cur) => {
      return prev + cur.duration
    }, 0)
  return totalLeave
}

function getLeaveRemaining(base, carried, taken) {
  const balance = base + carried - taken
  return balance
}

async function getLeaveDataFromDb(userId, leaveYear) {
  const leaveYearData = await api.holidays.getUserLeaveYearHoliday({ user: userId, leaveYear })
  return leaveYearData
}

async function getToilDataFromDb(userId) {
  const toilData = await api.holidays.getUserLeaveYearToil({ user: userId })
  return toilData
}

async function setToilBalance(userId) {
  const toilData = await getToilDataFromDb(userId)
  const toilEarned = toilData.filter(entry => {
    return entry.category === 'TOIL (earned)'
  }).reduce((accum, item) => accum + item.duration, 0)
  const toilTaken = toilData.filter(entry => {
    return entry.category === 'TOIL (taken)'
  }).reduce((accum, item) => accum + item.duration, 0)
  return (toilEarned - toilTaken)
}

export async function deleteLeaveEntry(userId, leaveYear, holidayId) {
  await api.holidays.deleteHoliday(holidayId)
  setHolidayDisplayData(userId, leaveYear)
}

export async function addLeaveEntry(userId, leaveYear, leaveDetail) {
  const leaveEntry = {
    user: userId,
    ...leaveDetail
  }
  await api.holidays.createHoliday(leaveEntry)
  setHolidayDisplayData(userId, leaveYear)
}

export async function editLeaveEntry(userId, leaveYear, leaveDetail) {
  const { id, ...leaveValues } = leaveDetail
  const holiday = {
    user: userId,
    ...leaveValues
  }
  await api.holidays.updateHoliday({ holidayId: id, holiday })
  setHolidayDisplayData(userId, leaveYear)
}

export async function getCategories() {
  const data = await api.categories.getCategories()
  categories.set(data)
  setColours(data)
}

async function setColours(categories) {
  let colours = {}
  categories.map(cat => {
    colours[cat.category] = cat.colour
    return colours
  })
  holColours.set(colours)
}

export async function getPublicHolidays(startYear, endYear) {
  // const res = await fetch(
  //   `${apiUrl}/bank-holidays/search?startYear=${startYear}&endYear=${endYear}`
  // )
  const bankHols = await api.bankHolidays.searchBankHolidays({ startYear, endYear })
  return bankHols
}