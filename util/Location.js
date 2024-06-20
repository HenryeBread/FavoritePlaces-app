const GOOGLE_API_KEY = ''

export function getMapPreview(lat, long) {
    const imagePreviewUrl = ``;
    return imagePreviewUrl;
}

export async function getAddress(lat, long) {
    const url = ``;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Failed to fetch address!');
    }

    const data = await response.json();
    const address = data.results[0].formatted_address;
    return address;
}