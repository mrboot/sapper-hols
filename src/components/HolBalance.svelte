<script>
  import { slide } from 'svelte/transition'
  import { cubicOut } from 'svelte/easing'

  import {
    leaveRemaining,
    leaveTaken,
    entitlementHours,
    carriedOver,
    toilRemaining
  } from '../stores/store.js'

  let visible = false

  function toggleVisible() {
    visible = !visible
  }

  const hoursToDays = hours => hours / 8

  const displayDays = hours => {
    const days = hoursToDays(hours)
    let word = ''
    switch (days) {
      case 0:
        word = 'days'
        break
      case 1:
        word = 'day'
        break
      default:
        word = 'days'
    }
    return `${hours} hours (${days} ${word})`
  }
</script>

<div class="balance-container">
  <div class="balance-title" on:click={toggleVisible}>
    <span class="fas fa-calendar-check" />
    <h2>Holiday Remaining: {displayDays($leaveRemaining)}</h2>
  </div>
  {#if visible}
    <div
      class="balances"
      transition:slide={{ delay: 250, duration: 300, easing: cubicOut }}>
      <ul class="fa-ul">
        <li>
          <span class="fa-li">
            <i class="fas fa-calendar-plus" />
          </span>
          Holiday Taken: {displayDays($leaveTaken)}
        </li>
        <li>
          <span class="fa-li">
            <i class="fas fa-calendar-plus" />
          </span>
          Entitlement: {displayDays($entitlementHours)}
        </li>
        <li>
          <span class="fa-li">
            <i class="fas fa-calendar-plus" />
          </span>
          Carried Over: {displayDays($carriedOver)}
        </li>
        <li>
          <span class="fa-li">
            <i class="fas fa-calendar-plus" />
          </span>
          Toil Remaining: {displayDays($toilRemaining)}
        </li>
      </ul>
    </div>
  {/if}
</div>

<style>
  .balance-container {
    margin-left: 2rem;
  }

  .balance-title {
    margin-top: 0%;
    margin-bottom: 0%;
    padding-bottom: 0%;
    cursor: default;
  }

  ul {
    margin-top: 0%;
  }

  li {
    font-size: 1rem;
  }

  .balances {
    margin-top: -8px;
    padding-top: 0%;
    padding-bottom: 1rem;
  }

  span {
    display: inline-block;
    /* padding-top: 13px; */
    padding-right: 3px;
    vertical-align: middle;
    /* margin-bottom: 0.5rem; */
  }

  h2 {
    display: inline-block;
    vertical-align: middle;
    /* margin-bottom: 5px; */
  }
</style>
