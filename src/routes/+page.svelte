<script>
	// Display all sets on home page

	import { onMount } from 'svelte';
	import Header from '$lib/Header.svelte';

	let sets = [];

	function capitalize(str) {
		return str.length === 0 ? str : str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
	}

	onMount(async () => {
		const response = await fetch('https://api.scryfall.com/sets');
		const data = await response.json();
		sets = data.data;
	});

	let display = 'grid';

	function toggleDisplay() {
		display = display === 'grid' ? 'list' : 'grid';
	}

	// maybe todo: filter sets based on set type and release date
	// maybe todo: share buttons for homepage and for set specific pages
	// maybe todo: show artwork only option
</script>

<Header text="{sets.length} Sets">
	<button class="btn-icon" on:click={toggleDisplay}>
		<svg
			class="w-4 h-4"
			fill="none"
			stroke-width="1.5"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d={display !== 'grid'
					? 'M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z'
					: 'M6 4h12a2 2 0 010 4h-12a2 2 0 010-4zm0 6h12a2 2 0 010 4h-12a2 2 0 010-4zm0 6h12a2 2 0 010 4h-12a2 2 0 010-4z'}
			></path>
		</svg>
	</button>
</Header>

{#if display === 'grid'}
	<div class="flex flex-wrap gap-4 justify-center">
		{#each sets as set}
			<a
				href="/set/{set.code}"
				title={set.name}
				class="set-link p-2 w-24 h-30 flex items-center justify-between gap-1 flex-col bg-gray-100 hover:bg-gray-200"
			>
				<img src={set.icon_svg_uri} alt={set.name} class="size-8 aspect-square" />
				<span class="font-mono font-bold text-lg">{set.code.toUpperCase()}</span>
				<!-- <span class="whitespace-nowrap text-ellipsis overflow-hidden text-xs w-[calc(100%)]">{set.name}</span> -->
				<span class="line-clamp-2 text-xs">{set.name}</span>
			</a>
		{/each}
	</div>
{:else}
	<div class="flex flex-col gap-4 justify-center">
		{#each sets as set}
			<a
				href="/set/{set.code}"
				title={set.name}
				class="set-link flex gap-2 sm:gap-4 p-2 items-center bg-gray-100 hover:bg-gray-200"
			>
				<img src={set.icon_svg_uri} alt={set.name} class="size-8 aspect-square" />
				<span class="sm: text-lg font-mono font-bold">{set.code.toUpperCase()}</span>
				<span class="text-xs sm:text-sm line-clamp-2 grow ml-4">{set.name}</span>
				<span class="text-xs sm:text-sm">{capitalize(set.set_type.split('_').join(' '))}</span>
				<span class="text-xs sm:text-sm">{set.digital ? 'Digital' : 'Paper'}</span>
				<span class="text-xs sm:text-sm">{set.card_count} cards</span>
				<span class="text-xs sm:text-sm font-mono">{set.released_at}</span>
			</a>
		{/each}
	</div>
{/if}
