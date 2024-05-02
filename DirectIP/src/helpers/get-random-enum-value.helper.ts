export function getRandomValue<T extends object>(obj: T): T[keyof T] {
	const values = Object.values(obj) as T[keyof T][];
	const randomIndex = Math.floor(Math.random() * values.length);
	return values[randomIndex];
}
