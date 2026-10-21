import { Injectable } from '@angular/core';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

import { GeolocationPosition, Plugins } from "@capacitor/core";

const { Geolocation } = Plugins;

declare var google;

@Injectable({
  providedIn: 'root'
})
export class MapaService
{
  posicion: GeolocationPosition;
  direccion: NativeGeocoderResult;

  constructor(private nativeGeocoder: NativeGeocoder) 
  {

  }

  async locate()
  {
    try
    {
      const coordinates = await Geolocation.getCurrentPosition();
      this.posicion = coordinates;
    }
    catch (e)
    {
      console.warn("Geolocation nativo no disponible, usando posición por defecto:", e);
      this.posicion = {
        coords: {
          latitude: -34.6623,
          longitude: -58.3647,
          accuracy: 10,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null
        },
        timestamp: Date.now()
      } as any;
    }
  }

  public async reverse(latitude: number, longitude: number)
  {
    try
    {
      let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
      };

      const direccion = await this.nativeGeocoder.reverseGeocode(latitude, longitude, options);
      if (direccion && direccion.length > 0)
      {
        this.direccion = direccion[0];
        return this.direccion;
      }
    }
    catch (error)
    {
      console.warn("Geocoder nativo no disponible en web, usando dirección simulada:", error);
    }

    this.direccion = {
      thoroughfare: "Av. Mitre",
      subThoroughfare: "750",
      locality: "Avellaneda",
      administrativeArea: "Buenos Aires",
      countryName: "Argentina",
      postalCode: "1870"
    } as NativeGeocoderResult;

    return this.direccion;
  }



}

