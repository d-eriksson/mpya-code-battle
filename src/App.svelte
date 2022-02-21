<script>
	import io from "socket.io-client";
	import { fade, blur, scale, slide, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	let name = "";
	let loggedIn = false;
	let started = false;
	let timeToStart;
	const socket = io();
	socket.on('start', (data) => {
		console.log(data);
		started = true;
		timeToStart = tweened(data.secondsToStart);
		startCounter();
		
	})
	let users = [];
	socket.on('user-change', (data) => {
		users = data;
	})
	socket.on('reset', (data) => {
		loggedIn = false;
		started = false;
		name = "";
	})
	function submit(){
		loggedIn = true;
		socket.emit('login', {name});
	}
	function startCounter(){
		var id = setInterval(() => {
			if ($timeToStart > 0) {
				$timeToStart--;
			}
			else{
				clearInterval(id);

			}
		}, 1000);
	}
	$: seconds = Math.floor($timeToStart)
	

</script>

<main>
	<div class="middle">
		{#if loggedIn}
			<div class="users"> 
				{#each users as user}
					<div class="user">{user.name}</div>
				{/each}
			</div>
		{:else if started}
			
				{#key seconds}
					<h1 
						in:fly="{{delay: 0, duration: 300, x: -100, y: 0, opacity: 0, easing: quintOut}}"
						out:fly="{{delay: 0, duration: 300, x: 100, y: 0, opacity: 0, easing: quintOut}}"
					>
						{seconds}
					</h1>
				{/key}
			
		{:else}
			<label>Username</label>
			<input 
				placeholder="Your username"
				bind:value={name}>
			<button on:click={submit} disabled={name.length <= 0}>Get Started</button>
		{/if}
	</div>
	
	
</main>

<style global>
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
		background: #E34586;
		color: white;
		min-height: calc(100vh - 2em);
	}
	h1{
		position:absolute;
		left:0;
		right:0;
	}
	input{
		display: block;
	}
	button{
		background: #00b2aa;
		color: white;
		border:none;
		border-radius: 0;
	}
	label{
		text-align: left;
		padding: 0.5em 0;
	}
	.middle{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>