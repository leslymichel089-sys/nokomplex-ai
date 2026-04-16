// netlify/functions/weather.js

exports.handler = async (event) => {
  const clientIP = event.headers['x-forwarded-for'] || event.headers['client-ip'] || '';

  try {
    // Étape 1 : Déterminer la ville via IP
    const geoRes = await fetch(`https://ipapi.co/${clientIP.split(',')[0].trim()}/json/`);
    const geo    = await geoRes.json();
    const city   = geo.city || 'Port-au-Prince';
    const lat    = geo.latitude  || 18.5944;
    const lon    = geo.longitude || -72.3074;

    // Étape 2 : Récupérer la météo
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 200,
        body: JSON.stringify({ temp: '--', city, condition: '' })
      };
    }

    const wxRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=fr`
    );
    const wx = await wxRes.json();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=600' },
      body: JSON.stringify({
        temp:      `${Math.round(wx.main.temp)}°C`,
        city,
        condition: wx.weather?.[0]?.description || ''
      })
    };

  } catch (err) {
    console.error('Weather function error:', err);
    return {
      statusCode: 200,
      body: JSON.stringify({ temp: '--', city: 'Inconnu', condition: '' })
    };
  }
};
