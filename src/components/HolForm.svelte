<script>
  /* eslint-disable no-unused-vars */
  import eachDayOfInterval from 'date-fns/eachDayOfInterval'
  import isWeekend from 'date-fns/isWeekend'
  import startOfDay from 'date-fns/startOfDay'
  import endOfDay from 'date-fns/endOfDay'
  import addMinutes from 'date-fns/addMinutes'
  import parseISO from 'date-fns/parseISO'
  import compareAsc from 'date-fns/compareAsc'
  import format from 'date-fns/format'
  import { createEventDispatcher } from 'svelte'

  import Flatpickr from 'svelte-flatpickr/src/Flatpickr.svelte'
  // We can import the below CSS as we have enabled in rollup.config
  import 'flatpickr/dist/flatpickr.css'
  import 'flatpickr/dist/themes/material_blue.css'

  // import { formData, dbLeaveYear } from "../stores/store.js";
  import { formData } from '../stores/store.js'

  export let categories
  export let dbLeaveYear

  const apiUrl = process.env.SAPPER_APP_API_URL
  const dispatch = createEventDispatcher()

  const flatpickrStartOptions = {
    onChange: (selectedDates, dateStr, instance) => {
      // make sure the passed in dateStr is an actual date so date-fns can use it
      const selectedStartDate = parseISO(dateStr)
      $formData.startDate = selectedStartDate

      if ($formData.endDate === '') {
        $formData.endDate = selectedStartDate
        $formData.duration = 8
      } else {
        const dateDiff = compareAsc(selectedStartDate, $formData.endDate)
        if (dateDiff === -1) {
          $formData.duration = getHolDuration(
            $formData.startDate,
            $formData.endDate
          )
        } else {
          $formData.endDate = new Date(dateStr)
          $formData.duration = 8
        }
      }
    }
  }

  const flatpickrEndOptions = {
    onChange: (selectedDates, dateStr, instance) => {
      const selectedEndDate = parseISO(dateStr)
      $formData.endDate = selectedEndDate
      setDuration()
    }
  }

  async function setDuration() {
    const holDuration = await getHolDuration(
      $formData.startDate,
      $formData.endDate
    )
    $formData.duration = holDuration
  }

  function addHolidayToDb(updatePayload) {
    dispatch('addEntry', updatePayload)
  }

  function updateHolidayInDb(updatePayload) {
    dispatch('updateEntry', updatePayload)
  }

  function updateHolidayBalances() {
    dispatch('updateBalances')
  }

  function onSubmit() {
    const tableIndex = $formData.itemIndex
    const leaveYear =
      $formData.leaveYear === '' ? dbLeaveYear : $formData.leaveYear
    const formUpdate = {
      id: $formData.id,
      description: $formData.description,
      startDate: $formData.startDate,
      endDate: $formData.endDate,
      category: $formData.category,
      duration: $formData.duration,
      leaveYear: leaveYear
    }
    if (tableIndex >= 0) {
      updateHolidayInDb(formUpdate)
    } else {
      addHolidayToDb(formUpdate)
    }
    formData.set({
      id: null,
      description: '',
      startDate: '',
      endDate: '',
      category: '',
      duration: 0,
      leaveYear: ''
    })
    updateHolidayBalances()
  }

  async function getHolDuration(from, to) {
    const fromDate = startOfDay(from)
    const toDate = endOfDay(to)
    const fromDateYear = fromDate.getFullYear()
    const toDateYear = toDate.getFullYear()
    const tzOffset = Math.abs(fromDate.getTimezoneOffset())
    // get an array of days for the selected holiday dates
    const selectedDays = eachDayOfInterval({
      start: fromDate,
      end: toDate
    })
    // adjust the time to be midnight on all the dates
    const adjSelectedDays = selectedDays.map(day =>
      addMinutes(new Date(day.toUTCString()), tzOffset)
    )
    let numHolDays = 0
    // dont filter weekends if it's TOIL (earned)
    if ($formData.category === 'TOIL (earned)') {
      numHolDays = adjSelectedDays.length
    } else {
      // remove weekend days (Sat & Sun) from the array
      const noWeekends = adjSelectedDays.filter(day => !isWeekend(day))
      // remove any Bank Holiday days from the array
      const weekDays = await filterBankHols(
        noWeekends,
        fromDateYear,
        toDateYear
      )
      // count the days left and multiply by 8 to get number of hours in  working day
      numHolDays = weekDays.length
    }
    return numHolDays * 8
  }

  async function filterBankHols(dateList, startYear, endYear) {
    const bankHols = await getPublicHolidays(startYear, endYear)
    const bankHolsArray = bankHols.map(bankHol => {
      return bankHol.date
    })
    const noBankHols = dateList
      .map(day => {
        return format(day, 'yyyy-MM-dd').toString()
      })
      .filter(day => {
        return !bankHolsArray.includes(day)
      })
    return noBankHols
  }

  async function getPublicHolidays(startYear, endYear) {
    const res = await fetch(
      `${apiUrl}/bank-holidays/search?startYear=${startYear}&endYear=${endYear}`
    )
    const bankHols = await res.json()
    return bankHols
  }
</script>

<style>
  .container {
    padding-top: 1rem;
  }

  .hr-text {
    line-height: 1em;
    position: relative;
    outline: 0;
    border: 0;
    color: black;
    font-size: 18px;
    text-align: center;
    height: 1.5em;
  }

  .hr-text:before {
    content: "";
    background: linear-gradient(to right, transparent, #818078, transparent);
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    height: 1px;
  }

  .hr-text:after {
    content: attr(data-content);
    position: relative;
    display: inline-block;
    color: black;
    padding: 0 0.5em;
    line-height: 1.5em;
    color: #9c9c9c;
    background-color: #dee5f3;
  }

  form {
    display: inline-grid;
    padding: 1em;
    width: 600px;
  }

  form input {
    background: #fff;
    border: 1px solid #9c9c9c;
    font-size: 14px;
    color: #3f3f3f;
  }

  .datefield {
    display: inline-block;
    width: 30%;
    font-size: 14px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
      "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial,
      sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    font-variant: tabular-nums;
  }

  #start-date {
    display: inline;
  }
  #end-date {
    display: inline;
  }

  form input:hover {
    border-color: #40a9ff;
  }

  form select:hover {
    border-color: #40a9ff;
  }

  form button:hover {
    background: #40a9ff;
  }

  label {
    padding: 0.5em 0.5em 0.5em 0;
  }

  input {
    padding: 6px;
    border-radius: 4px;
  }

  input:focus {
    border: 1px solid #40a9ff;
  }

  select:focus {
    border: 1px solid #40a9ff;
  }

  #duration {
    width: 20%;
  }

  @media (min-width: 400px) {
    form {
      grid-template-columns: 200px 1fr;
      grid-gap: 16px;
    }

    label {
      text-align: right;
      grid-column: 1 / 2;
    }

    input {
      grid-column: 2 / 3;
    }

    .daterange {
      grid-column: 2 / 3;
    }

    button {
      grid-column: 2 / 2;
    }
  }

  select {
    background: #fff;
    border: 1px solid #9c9c9c;
    border-radius: 4px;
    width: 100%;
    padding: 6px;
    font-size: 14px;
    color: #3f3f3f;

    /* Here's the code we need */
    -webkit-appearance: none;
    -moz-appearance: none;
    -ms-appearance: none;
    -o-appearance: none;
    appearance: none;
  }

  .select-wrapper {
    position: relative;
    width: 50%;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
      "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial,
      sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    font-variant: tabular-nums;
  }

  .select-wrapper:after {
    font-family: "Font Awesome 5 Free";
    content: "\f078";
    font-weight: 900;
    position: absolute;
    top: 6px;
    right: 15px;
    color: #434b67;
    pointer-events: none;
  }

  select::-ms-expand {
    display: none;
  }

  .submit-button {
    margin: 5px;
    line-height: 1.499;
    display: inline-block;
    font-weight: 400;
    white-space: nowrap;
    text-align: center;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    user-select: none;
    touch-action: manipulation;
    height: 32px;
    width: 30%;
    padding: 0 15px;
    font-size: 14px;
    border-radius: 4px;
    color: #fff;
    background-color: #1890ff;
    border-color: #1890ff;
    text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
  }

  #datespan {
    margin: 5px;
  }
</style>

<div class="container">
  <hr class="hr-text" data-content="Add a Holiday" />
</div>

<form class="form1" on:submit|preventDefault={onSubmit} id="hol-form">

  <label for="holdesc" class="description">Holiday Description</label>
  <input bind:value={$formData.description} id="holdesc" type="text" />

  <label for="category" class="category">Category</label>
  <div class="select-wrapper">
    <select bind:value={$formData.category} class="select-css" id="category">
      {#each $categories as category}
        <option value={category.category}>{category.category}</option>
      {/each}
    </select>
  </div>

  <label for="startdate">Dates (from - to)</label>

  <div class="daterange">
    <Flatpickr
      options={flatpickrStartOptions}
      bind:value={$formData.startDate}
      element="#start-date">
      <div class="flatpickr" id="start-date">
        <input
          type="text"
          class="datefield"
          placeholder="Select Start Date"
          data-input />
      </div>
    </Flatpickr>
    <span id="datespan">-</span>
    <Flatpickr
      options={flatpickrEndOptions}
      bind:value={$formData.endDate}
      element="#end-date">
      <div class="flatpickr" id="end-date">
        <input
          type="text"
          class="datefield"
          placeholder="Select End Date"
          data-input />
      </div>
    </Flatpickr>
  </div>

  <label for="duration">Duration (hours)</label>
  <input bind:value={$formData.duration} id="duration" type="number" />

  <button type="submit" class="submit-button">
    {#if $formData.itemIndex >= 0}Update{:else}Add{/if}
  </button>
</form>
