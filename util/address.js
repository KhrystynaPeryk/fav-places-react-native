export async function getAddress(lat, lng) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

    try {
        const response = await fetch(url);

        const data = await response.json();
        if (data.address) {
            const { road, house_number, postcode, city, country } = data.address;
            const formattedAddress = `${road} ${house_number}, ${postcode} ${city}, ${country}`;

            return formattedAddress;
        }
    } catch (error) {
        throw new Error("Failed to fetch address!");
    }
}