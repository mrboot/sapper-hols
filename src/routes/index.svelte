<script>
  import { onMount } from "svelte";
  import compareAsc from "date-fns/compareAsc";

  import HolForm from "../components/HolForm.svelte";
  import NavBar from "../components/NavBar.svelte";
  import HolTable from "../components/HolTable.svelte";
  import HolBalance from "../components/HolBalance.svelte";

  import {
    tableData,
    dbLeaveYear,
    displayLeaveYear,
    user,
    currentEntitlement,
    leaveRemaining,
    leaveTaken,
    entitlementHours,
    carriedOver,
    toilRemaining,
    categories
  } from "../stores/store.js";

  // manually setting userId is a hack until auth is implemented
  const userId = process.env.SAPPER_APP_USER_ID;

  const apiUrl = process.env.SAPPER_APP_API_URL;

  async function getCategories() {
    const res = await fetch(`${apiUrl}/categories`);
    const cats = await res.json()
    categories.set(cats)
  }

  async function getLeaveData(user, leaveYear) {
    let entitlement = await getEntitlement(user, leaveYear);
    if (entitlement.length === 0) {
      entitlement = await setEntitlement();
    }
    const base = entitlement[0].base;
    const carried = entitlement[0].carried;
    const holidays = await getLeaveDataFromDb(user, leaveYear);
    const taken = await getLeaveTaken(holidays);
    const remaining = getLeaveRemaining(base, carried, taken);
    return { entitlement, holidays, taken, remaining };
  }

  async function setHolidayDisplayData(user, leaveYear) {
    const { entitlement, holidays, taken, remaining } = await getLeaveData(
      user,
      leaveYear
    );
    const toilBalance = await setToilBalance($user);
    toilRemaining.set(toilBalance);
    entitlementHours.set(entitlement[0].base);
    carriedOver.set(entitlement[0].carried);
    tableData.set(holidays);
    leaveTaken.set(taken);
    leaveRemaining.set(remaining);
  }

  function getLeaveTaken(data) {
    const totalLeave = data
      .filter(entry => {
        return entry.category === "Holiday";
      })
      .reduce((prev, cur) => {
        return prev + cur.duration;
      }, 0);
    return totalLeave;
  }

  function getLeaveRemaining(base, carried, taken) {
    const balance = base + carried - taken;
    return balance;
  }

  function getCurrentLeaveYear() {
    const today = new Date();
    const currYear = today.getFullYear();
    const twoDigitYear = currYear.toString().slice(-2);
    const cutoffDate = `${twoDigitYear}-04-01`
    const result = compareAsc(today, new Date(cutoffDate));
    if (result === -1) {
      $dbLeaveYear = `${parseInt(twoDigitYear, 10) - 1}${twoDigitYear}`;
    } else {
      $dbLeaveYear = `${twoDigitYear}${parseInt(twoDigitYear, 10) + 1}`;
    }
  }

  function setLeaveYear(event) {
    let direction = event.detail.direction;
    let fromYear =
      direction === "up"
        ? parseInt($dbLeaveYear.slice(0, 2)) + 1
        : parseInt($dbLeaveYear.slice(0, 2)) - 1;
    let toYear =
      direction === "up"
        ? parseInt($dbLeaveYear.slice(-2)) + 1
        : parseInt($dbLeaveYear.slice(-2)) - 1;
    $dbLeaveYear = `${fromYear}${toYear}`;
    setDisplayLeaveYear();
    setHolidayDisplayData($user, $dbLeaveYear);
  }

  function setDisplayLeaveYear() {
    $displayLeaveYear = `${$dbLeaveYear.slice(0, 2)}/${$dbLeaveYear.slice(-2)}`;
  }

  async function getEntitlement(user, leaveYear) {
    const res = await fetch(
      `${apiUrl}/entitlements?user=${user}&leaveYear=${leaveYear}`
    );
    const entitlement = await res.json();
    return entitlement;
  }

  async function setEntitlement(base = 200, carried = 0) {
    const entitlementData = {
      user: $user,
      leaveYear: $dbLeaveYear,
      base,
      carried,
    };
    const res = await fetch(`${apiUrl}/entitlements`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(entitlementData)
    });
    const entitlement = await getEntitlement($user, $dbLeaveYear);
    return entitlement;
  }

  async function getLeaveDataFromDb(user, leaveYear) {
    const res = await fetch(
      `${apiUrl}/holidays?user=${user}&leaveYear=${leaveYear}`
    );
    const leaveYearData = await res.json();
    return leaveYearData;
  }

  async function getToilDataFromDb(user) {
    const res = await fetch(`${apiUrl}/holidays/toil?user=${user}`);
    const toilData = await res.json();
    return toilData;
  }

  async function setToilBalance(user) {
    const toilData = await getToilDataFromDb(user);
    const toilEarned = toilData.filter(entry => {
      return entry.category === "TOIL (earned)";
    });
    const toilTaken = toilData.filter(entry => {
      return entry.category === "TOIL (taken)";
    });
    return (toilEarned.length - toilTaken.length) * 8;
  }

  function refreshLeaveData() {
    setHolidayDisplayData($user, $dbLeaveYear);
  }

  async function deleteLeaveEntry(event) {
    const holId = event.detail.holId;
    const res = await fetch(`${apiUrl}/holidays/${holId}`, {
      method: "DELETE"
    });
    refreshLeaveData();
  }

  async function addLeaveEntry(event) {
    const leaveEntry = {
      user: $user,
      // leaveYear: $dbLeaveYear,
      ...event.detail
    };
    console.log(leaveEntry)
    const res = await fetch(`${apiUrl}/holidays`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(leaveEntry)
    });
    refreshLeaveData();
  }

  async function editLeaveEntry(event) {
    const {id, ...leaveValues} = event.detail
    const leaveEntry = {
      user: $user,
      // leaveYear: $dbLeaveYear,
      ...leaveValues
    };
    const res = await fetch(`${apiUrl}/holidays/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(leaveEntry)
    });
    refreshLeaveData();
  }

  onMount(() => {
    $user = userId;
    getCategories()
    getCurrentLeaveYear();
    setDisplayLeaveYear();
    setHolidayDisplayData($user, $dbLeaveYear);
  });
</script>

<NavBar on:changeLeaveYear={setLeaveYear} />
<HolBalance />
<HolTable on:deleteEntry={deleteLeaveEntry} />
<HolForm
  on:addEntry={addLeaveEntry}
  on:updateEntry={editLeaveEntry}
  on:updateBalances={refreshLeaveData}
  />
