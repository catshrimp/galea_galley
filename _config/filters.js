import { DateTime } from "luxon";

export default function(eleventyConfig) {
	eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
		// Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
		return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(format || "dd.LL.yyyy");
	});

	eleventyConfig.addFilter("htmlDateString", (dateObj) => {
		// dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
		return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat('yyyy-LL-dd');
	});

	// Get the first `n` elements of a collection.
	eleventyConfig.addFilter("head", (array, n) => {
		if(!Array.isArray(array) || array.length === 0) {
			return [];
		}
		if( n < 0 ) {
			return array.slice(n);
		}

		return array.slice(0, n);
	});

	// Return the smallest number argument
	eleventyConfig.addFilter("min", (...numbers) => {
		return Math.min.apply(null, numbers);
	});

	// Return the keys used in an object
	eleventyConfig.addFilter("getKeys", target => {
		return Object.keys(target);
	});

	eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
		return (tags || []).filter(tag => ["all", "posts"].indexOf(tag) === -1);
	});

	eleventyConfig.addFilter("sortAlphabetically", strings =>
		(strings || []).sort((b, a) => b.localeCompare(a))
	);

	// Extract excerpt from HTML content
	eleventyConfig.addFilter("excerpt", (content, maxLength = 200) => {
		if (!content) return '';
		// Strip HTML tags
		const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
		if (text.length <= maxLength) return text;
		return text.substring(0, maxLength).trim() + '...';
	});

	// Calculate reading time based on character count
	eleventyConfig.addFilter("readingTime", (content) => {
		if (!content) return 0;
		// Strip HTML tags
		const text = content.replace(/<[^>]*>/g, '');
		const charCount = text.length;
		// Average reading speed: ~2000 characters per minute (Russian text)
		const minutes = Math.ceil(charCount / 2000);
		return minutes;
	});

	// Sort tags by popularity (number of posts)
	eleventyConfig.addFilter("sortByPopularity", function(tags, collections) {
		return (tags || []).sort((a, b) => {
			const countA = collections[a] ? collections[a].length : 0;
			const countB = collections[b] ? collections[b].length : 0;
			return countB - countA; // Descending order
		});
	});
};
