import { writable } from 'svelte/store';

export let dbLeaveYear = writable('');
export let displayLeaveYear = writable('');

export let user = writable('ck4smhcc70000c54pdnzgmewt');

export let formData = writable({
  itemIndex: undefined,
  id: undefined,
  description: "",
  startDate: "",
  endDate: "",
  category: "Holiday",
  duration: 0,
  leaveYear: ""
});

export let tableData = writable([]);
export let currentEntitlement = writable([]);
export let leaveRemaining = writable(0);
export let leaveTaken = writable(0);
export let entitlementHours = writable(0);
export let carriedOver = writable(0);
export let toilRemaining = writable(0);