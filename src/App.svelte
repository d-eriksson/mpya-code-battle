<script>
	import io from "socket.io-client";
	import { fly } from 'svelte/transition';
	import { tweened } from "svelte/motion";

	import Menu from "./components/Menu.svelte";
	import Contestant from "./components/Contestant.svelte";
	import Podium from "./components/Podium.svelte"
	import Countdown from "./components/Countdown.svelte";
	import Login from "./components/Login.svelte";

	let loggedIn = false;
	let started = false;
	let isAdmin = false;
	let users = [];
	let showWinners = false;
	let winners = [];
	let timeToStart;
	const socket = io();

	socket.on('user-change', (data) => {
		if(socket.id == data.socketId){
			loggedIn = true;
		}
		console.log(data)
		users = data.userData;
	})
	socket.on('admin-users', (data) => {
		loggedIn = true;
		isAdmin = true;
		users = data;
	})
	socket.on('reset', (data) => {
		if(!isAdmin){
			loggedIn = false;
		}
		started = false;
		users = []
		winners = []
	})
	socket.on('display-winners', (data)=>{
		console.log(data);
		winners = data;
		showWinners = true;
	})
	socket.on('display-main-menu', () => {
		console.log('Display main menu')
		if (loggedIn)
			showWinners = false;
	})
	socket.on('start', (data) => {
		if (loggedIn) {
			started = true;
			timeToStart = tweened(data.secondsToStart);
			startCounter(`https://cssbattle.dev/play/${data.gameId}`);
		}
	})

	function startCounter(url){
		var id = setInterval(() => {
			if ($timeToStart > 0) {
				$timeToStart--;
			}
			else{
				clearInterval(id);
				if(!isAdmin){
					window.location.href = url;
				}
			}
		}, 1000);
	}

	$: seconds = Math.floor($timeToStart)
</script>

<main class="height--full flex--row">
	{#if !loggedIn}
		<Login
			socket={socket}
		/>
	{:else}
		<div 
			class="lobby width--full height--full flex--row" 
		>
			<Menu 
				showWinners={showWinners} 
				isAdmin={isAdmin}
			/>
			<div 
				class="contestants width--full height--full flex--column"
			> 
				{#if started && !isAdmin}
					<Countdown
						seconds={seconds}
					/>
				{/if}
				{#if showWinners}
					<Podium
						winners={winners}	
					/>	
				{:else}
					<h1 class="text-align-center">Contestants</h1>
					<div 
						class="grid"
						in:fly="{{ x: 200, duration: 700 }}"
					>
						{#each users as user}
							<Contestant
								name={user.name}
								points={user.points}
								pointsToAdd={users.pointsToAdd}
								canChangePoints={!showWinners && isAdmin}
							/>
						{/each}
					</div>
				{/if}
			</div>	
		</div>
	{/if}
</main>

<style>
	.contestants{
		background: var(--mpya-pink);
		overflow-y: scroll;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
	}

	h1 {
		padding: var(--padding-small) 0;
	}

	@media screen and (max-width: 940px) {
		.lobby {
			flex-direction: column;
			align-items: center;
		}

		.contestants {
			margin-top: 20px;
			overflow-y: unset;
		}
	}
</style>