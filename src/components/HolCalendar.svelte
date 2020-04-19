<script>
  import {onMount} from 'svelte'
  import tippy from 'tippy.js';
  import Calendar from 'js-year-calendar';
  import 'js-year-calendar/dist/js-year-calendar.css';
  import 'tippy.js/dist/tippy.css';
  import 'tippy.js/themes/material.css';

  import { user } from "../stores/store.js";
  export let colours
  export let dbLeaveYear

  let tooltip = null;

  function getCalDates(leaveYear) {
    const calStartDate = `20${leaveYear.slice(0, 2)}-03-31`
    const calEndDate = `20${leaveYear.slice(-2)}-03-31`
    return {calStartDate, calEndDate}
  }

  function toggleCal() {
    const {calStartDate, calEndDate} = getCalDates(dbLeaveYear)
    const cal = document.getElementById("caldisplay");
    if (cal.style.display === "none" || cal.style.display === '') {
      cal.style.display = "block";
    } else {
      cal.style.display = "none";
    }

    // Need to wrap in check for browser as the calendar component is client side only
    // if(process.browser === true) {
    const calendar = new Calendar('.calendar', {
      style: 'background',
      minDate: new Date(calStartDate),
      maxDate: new Date(calEndDate),
      mouseOnDay: function(e) {
        if (e.events.length > 0) {
          let content = '';
                    
          for (let i in e.events) {
            content += '<div class="event-tooltip-content">'
              // + '<div class="event-name">' + e.events[i].name + '</div>'
              + '<div class="event-name" style="color:' + e.events[i].color + '">' + e.events[i].name + '</div>'
              + '</div>';
          }
          
          if (tooltip !== null) {
            tooltip.destroy();
            tooltip = null;
          }
          
          tooltip = tippy(e.element, {
              theme: 'material',
              placement: 'right',
              content: content,
              allowHTML: true,
              // animateFill: false,
              animation: 'shift-away',
              arrow: true
          });
          tooltip.show();
        }
      },
      mouseOutDay: function() {
        if (tooltip !== null) {
          tooltip.destroy();
          tooltip = null;
        }
      }
    })
    calendar.setDataSource(function() {
      return fetch(`http://10.0.0.38:5337/holidays?user=${$user}&leaveYear=${dbLeaveYear}`)
        .then(result => result.json())
        .then(result => {
          if (result) {
            return result.map(r => ({
              startDate: new Date(r.startDate),
              endDate: new Date(r.endDate),
              name: r.description,
              color: `light${colours[r.category]}`
            }));
          }
          
          return [];
        });
    })
  // };
  } 
</script>

<div class="container">
  <button class="display-button" on:click={toggleCal}>Show Calendar</button>
  <div id="caldisplay">
    <div class="calendar"></div>
  </div>
</div>

<style>
  .container {
    text-align: center;
  }

  .display-button {
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
  .calendar {
    font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
    width: 100%;
  }

  .event-tooltip-content {
    padding: 5px;
  }

  .event-tooltip-content:not(:last-child) {
    border-bottom: 1px solid #ccc;
  }
</style>