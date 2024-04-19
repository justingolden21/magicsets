import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const response = await fetch('https://api.scryfall.com/sets');
	const data = await response.json();
	const sets = data.data.map((set) => set.code);

	const set = params.set.trim().toLowerCase();
	if (sets.includes(set)) {
		return { set };
	}

	error(404, 'Not found');
}
