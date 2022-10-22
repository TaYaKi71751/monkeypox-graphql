export function split (r:string) {
	const arr:Array<string> = [];
	let quoteEnd = 0;
	let nextComma = 0;
	let currentStart = 0;
	let currentString = '';
	for (let i = 0; i <= r.length; i++) {
		switch (r[i]) {
		case '"':
			currentStart = i + 1;
			quoteEnd = r.indexOf('"', i + 1);
			break;
		case '\'':
			currentStart = i + 1;
			quoteEnd = r.indexOf('\'', i + 1);
			break;
		default:
			currentStart = i;
			quoteEnd = i;
			break;
		}
		nextComma = r.indexOf(',', quoteEnd);
		nextComma = nextComma == -1 ? r.length : nextComma;
		currentString = r.substring(currentStart, nextComma);
		arr.push(currentString);
		i = nextComma;
	}
	return arr;
}
