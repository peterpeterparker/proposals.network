export const assertBytes = ({
	text,
	min,
	max
}: {
	text: string;
	min: number;
	max: number;
}): boolean => {
	const byteLength = new TextEncoder().encode(text).length;
	return byteLength >= min && byteLength <= max;
};
