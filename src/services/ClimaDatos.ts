import axios from "axios";

type OpenMeteoResponse = {
  hourly: {
    temperature_2m: (number | undefined)[];
    shortwave_radiation: (number | undefined)[];
    time: (string | undefined)[];
  };
};

export async function getClimaActual(lat: number, lon: number) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,shortwave_radiation&timezone=auto`;

  try {
    const response = await axios.get(url);
    const data = response.data as OpenMeteoResponse;

    const temps = data.hourly.temperature_2m;
    const luz = data.hourly.shortwave_radiation;
    const horas = data.hourly.time;

    // Obtener hora local actual en formato 'YYYY-MM-DDTHH'
    const ahora = new Date().toISOString().slice(0, 13); // Puede no coincidir con hora local
    // Alternativa si prefieres precisión:
    // const ahora = new Date().toLocaleString("sv-SE", { timeZone: "America/Argentina/Buenos_Aires" }).slice(0, 13);

    for (let i = 0; i < horas.length; i++) {
      if (
        horas[i]?.startsWith(ahora) &&
        temps[i] !== undefined &&
        luz[i] !== undefined
      ) {
        return {
          hora: horas[i],
          temperatura: temps[i]!,
          luzSolar: luz[i]!,
          esDeDia: luz[i]! > 0,
        };
      }
    }

    return null;
  } catch (error) {
    console.error("Error al obtener clima:", error);
    return null;
  }
}
