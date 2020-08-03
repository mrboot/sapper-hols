<script context="module">
	import {getCurrentLeaveYear, getCategories, setUser} from '../stores/store'
  export async function preload() {
		setUser()
		getCurrentLeaveYear()
		getCategories()
  }
</script>

<script>
	import Nav from '../components/Nav.svelte';

	export let segment;
</script>

<style>
	/* main {
		position: relative;
		max-width: 56em;
		background-color: white;
		padding: 2em;
		margin: 0 auto;
		box-sizing: border-box;
	} */
</style>

<Nav {segment}/>

<main>
	<slot></slot>
</main>
