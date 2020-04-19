<script>
  import { createEventDispatcher } from "svelte";
  import { displayLeaveYear } from "../stores/store.js";

  const dispatch = createEventDispatcher();

  function adjustLeaveYear(direction) {
    dispatch("changeLeaveYear", { direction });
    const cal = document.getElementById("caldisplay");
    if (cal.style.display = "block") {
      cal.style.display = "none";
    }
  }
</script>

<style>
  header {
    border-bottom: 1px solid #9c9c9c;
    margin-bottom: 0px;
    padding-bottom: 10px;
  }

  h1 {
    font-family: "Syncopate", sans-serif;
    font-size: 25px;
    margin: 0px 0px 0px 5px;
    color: #0c203c;
    display: inline-block;
    vertical-align: middle;
  }

  #logo {
    display: inline-block;
    width: 40px;
    height: 40px;
    vertical-align: middle;
  }

  div {
    padding-left: 20px;
    display: inline-block;
  }

  p {
    display: inline-block;
    font-size: 18px;
    font-weight: 400;
    vertical-align: middle;
  }

  button {
    vertical-align: middle;
  }

  .ant-btn {
    vertical-align: middle;
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

  .ant-btn-edit {
    background-color: #4169e1;
    /* color: #e0e4eb; */
    color: #fff;
    border-color: #4169e1;
  }

  .ant-btn-edit:hover {
    color: #fff;
    background-color: #1648df;
    border-color: #4169e1;
  }
</style>

<header>
  <img src="/profile.png" alt="MBMakes Logo" id="logo" />
  <h1>MBMakes</h1>
  <div>
    <button
      class="ant-btn ant-btn-edit"
      type="button"
      on:click={() => {
        adjustLeaveYear('down');
      }}>
      <i class="fas fa-arrow-circle-left" />
      Previous
    </button>
    <p>Current Leave Year: {$displayLeaveYear}</p>
    <button
      class="ant-btn ant-btn-edit"
      type="button"
      on:click={() => {
        adjustLeaveYear('up');
      }}>
      Next
      <i class="fas fa-arrow-circle-right" />
    </button>
  </div>
</header>
