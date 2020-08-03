<script>
  import Swal from 'sweetalert2'
  import { format } from 'date-fns'
  import parseISO from 'date-fns/parseISO'
  import { onMount } from 'svelte'

  import { 
    tableData, 
    formData, 
    holColours, 
    user, 
    dbLeaveYear, 
    setHolidayDisplayData, 
    deleteLeaveEntry 
  } from '../stores/store.js'

  const hoursToDays = hours => hours / 8

  const displayDays = hours => {
    if (hours === 0) {
      return ''
    }
    const days = hoursToDays(hours)
    const word = days > 1 ? 'days' : 'day'
    return `${hours} hours (${days} ${word})`
  }

  const displayDates = holDate => {
    const holTrueDate = parseISO(holDate)
    return format(holTrueDate, 'EEE do LLL yyyy')
  }

  function editHoliday(data, index) {
    const editData = {
      itemIndex: index,
      id: data.id,
      description: data.description,
      startDate: parseISO(data.startDate),
      endDate: parseISO(data.endDate),
      category: data.category,
      duration: data.duration,
      leaveYear: data.leaveYear
    }
    formData.set(editData)
  }

  function deleteHolFromDb(holId) {
    deleteLeaveEntry($user, $dbLeaveYear, holId)
  }

  const deleteHoliday = hol => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showClass: {
        popup: ''
      },
      hideClass: {
        popup: ''
      },
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        deleteHolFromDb(hol.id)
        Swal.fire({
          title: 'Deleted!',
          text: 'Holiday has been deleted.',
          icon: 'success',
          showClass: {
            popup: ''
          },
          hideClass: {
            popup: ''
          }
        })
      }
    })
  }

  onMount(() => {
    setHolidayDisplayData($user, $dbLeaveYear);
  })
</script>

<table class="table-fill">
  <thead>
    <tr>
      <th>Description</th>
      <th>Start Date</th>
      <th>End Date</th>
      <th>Category</th>
      <th>Duration</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {#each $tableData as holiday, index}
      <tr key={holiday.id}>
        <td>{holiday.description}</td>
        <td>{displayDates(holiday.startDate)}</td>
        <td>{displayDates(holiday.endDate)}</td>
        <td>
          <span class={`tag tag-${$holColours[holiday.category]}`}>
            {holiday.category.toUpperCase()}
          </span>
        </td>
        <td>{displayDays(holiday.duration)}</td>
        <td class="text-left">
          <button
            class="ant-btn ant-btn-edit"
            type="button"
            on:click={() => editHoliday(holiday, index)}>
            <i class="fas fa-edit" />
            <span>Edit</span>
          </button>
          <button
            class="ant-btn ant-btn-danger"
            type="button"
            on:click={() => deleteHoliday(holiday)}>
            <i class="fas fa-times-circle" />
            <span>Delete</span>
          </button>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  /*** Table Styles **/
  .table-fill {
    background: white;
    border-radius: 3px;
    border-collapse: collapse;
    /*   height: 320px; */
    margin: auto;
    /* max-width: 1000px; */
    padding: 5px;
    width: 90%;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
    animation: float 5s infinite;
  }

  th {
    color: #d5dde5;
    background: #0074d9;
    border-bottom: 4px solid #9ea7af;
    border-right: 1px solid #b6b8c9;
    font-size: 20px;
    font-weight: 300;
    padding: 18px;
    text-align: left;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
    vertical-align: middle;
  }

  th:first-child {
    border-top-left-radius: 3px;
  }

  th:last-child {
    border-top-right-radius: 3px;
    border-right: none;
  }

  tr {
    border-top: 1px solid #c1c3d1;
    border-bottom: 1px solid #c1c3d1;
    color: #666b85;
    font-size: 14px;
    font-weight: normal;
  }

  tr:hover td {
    background: #ada9bb;
    color: #ffffff;
    border-top: 1px solid #22262e;
  }

  tr:first-child {
    border-top: none;
  }

  tr:last-child {
    border-bottom: none;
  }

  tr:nth-child(odd) td {
    background: #ebebeb;
  }

  tr:nth-child(odd):hover td {
    background: #ada9bb;
  }

  tr:last-child td:first-child {
    border-bottom-left-radius: 3px;
  }

  tr:last-child td:last-child {
    border-bottom-right-radius: 3px;
  }

  td {
    background: #ffffff;
    padding: 15px;
    text-align: left;
    vertical-align: middle;
    font-weight: 300;
    font-size: 16px;
    border-right: 1px solid #c1c3d1;
  }

  td:last-child {
    border-right: 0px;
  }

  td.text-left {
    text-align: left;
  }

  /* tags */

  .tag {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.65);
    font-variant: tabular-nums;
    line-height: 1.5;
    list-style: none;
    -webkit-font-feature-settings: "tnum";
    font-feature-settings: "tnum";
    display: inline-block;
    height: auto;
    margin-right: 8px;
    padding: 0 7px;
    font-size: 12px;
    font-weight: 300;
    line-height: 20px;
    white-space: normal;
    background: #fafafa;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    cursor: pointer;
    opacity: 1;
    -webkit-transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
    transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  .tag-purple {
    color: #722ed1;
    background: #f9f0ff;
    border-color: #d3adf7;
  }

  .tag-green {
    color: #52c41a;
    background: #f6ffed;
    border-color: #b7eb8f;
  }

  .tag-blue {
    color: #2f54eb;
    background: #f0f5ff;
    border-color: #adc6ff;
  }

  .tag-gold {
    color: #faad14;
    background: #fffbe6;
    border-color: #ffe58f;
  }

  .tag:hover {
    opacity: 0.85;
  }

  /* buttons */

  .ant-btn {
    line-height: 1.499;
    position: relative;
    display: inline-block;
    margin: 3px;
    font-weight: 400;
    white-space: nowrap;
    text-align: center;
    background-image: none;
    border: 1px solid transparent;
    -webkit-box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
    cursor: pointer;
    -webkit-transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    padding: 5px 10px;
    font-size: 14px;
    border-radius: 4px;
    color: rgba(0, 0, 0, 0.65);
    background-color: #fff;
    border-color: #d9d9d9;
    box-shadow: 0 2.5px 5px rgba(0, 0, 0, 0.2);
  }

  .ant-btn,
  .ant-btn:active,
  .ant-btn:focus {
    outline: 0;
  }

  .ant-btn-danger {
    color: #f5222d;
    background-color: #e0e4eb;
    border-color: #f5222d;
  }

  .ant-btn-danger:hover {
    color: #fff;
    background-color: #ff4d4f;
    border-color: #ff4d4f;
  }

  .ant-btn > span {
    padding-left: 4px;
  }

  .ant-btn-edit {
    color: #4169e1;
    background-color: #e0e4eb;
    border-color: #4169e1;
  }

  .ant-btn-edit:hover {
    color: #fff;
    background-color: #4169e1;
    border-color: #4169e1;
  }
</style>