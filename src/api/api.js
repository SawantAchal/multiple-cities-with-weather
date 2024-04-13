export const fetchCityData = async () => {
  try {
    const response = await fetch('https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=20');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    console.log(response)
    const data = await response.json();
    console.log('API data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};
