<script>
	import {user, dbLeaveYear, displayLeaveYear, setLeaveYear, setHolidayDisplayData} from '../stores/store'
	export let segment;

	function adjustLeaveYear(direction, leaveYear) {
		setLeaveYear(direction, leaveYear)
		setHolidayDisplayData($user, $dbLeaveYear)
		// const cal = document.getElementById('caldisplay')
    // if (cal.style.display === 'block') {
    //   cal.style.display = 'none'
    // }
  }
</script>

<nav>
	<ul>
		<li>  
			<div>
				<button
				class="ant-btn ant-btn-edit"
				type="button"
				on:click={() => {
					adjustLeaveYear('down', $dbLeaveYear);
				}}>
				<i class="fas fa-arrow-circle-left" />
				Previous
				</button>
				<!-- <p>Current Leave Year: {$displayLeaveYear}</p> -->
				<p>Current Leave Year: {$displayLeaveYear}</p>
				<button
					class="ant-btn ant-btn-edit"
					type="button"
					on:click={() => {
					adjustLeaveYear('up', $dbLeaveYear);
					}}>
						Next
					<i class="fas fa-arrow-circle-right" />
				</button>
			</div>
		</li>
		<div class="showright">
			<li><a aria-current='{segment === undefined ? "page" : undefined}' href='.'>home</a></li>
			<li><a aria-current='{segment === "about" ? "page" : undefined}' href='about'>about</a></li>
	
			<!-- for the blog link, we're using rel=prefetch so that Sapper prefetches
					the blog data when we hover over the link or tap it on a touchscreen -->
			<!-- <li><a rel=prefetch aria-current='{segment === "dates" ? "page" : undefined}' href='dates'>dates</a></li> -->
		</div>
	</ul>
</nav>

<style>
	nav {
		border-bottom: 1px solid rgba(255,62,0,0.1);
		font-weight: 300;
		padding: 0 1em;
	}

	ul {
		margin: 0;
		padding: 0;
	}

	.showright {
		flex: auto;
		/* border: 1px solid red; */
		justify-content: right;
		/* width: 70%; */
	}

	/* clearfix */
	ul::after {
		content: '';
		display: block;
		clear: both;
	}

	li {
		display: block;
		float: left;
	}

	[aria-current] {
		position: relative;
		display: inline-block;
	}

	[aria-current]::after {
		position: absolute;
		content: '';
		width: calc(100% - 1em);
		height: 2px;
		background-color: rgb(255,62,0);
		display: block;
		bottom: -1px;
	}

	a {
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
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