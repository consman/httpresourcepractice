import { inject, Injectable, Injector, signal, WritableSignal } from '@angular/core';
import { Jeocode } from './funTypes';
import { httpResource } from '@angular/common/http';

declare const W_APP_ID: string;

@Injectable({ providedIn: 'root' })
export class Prodweather {
    wAppId = W_APP_ID;
    dummySig:WritableSignal<String | undefined>= signal(new Date().getTime()+'');

    getJeoCodeByUnKnownZipSig(zip: string): void { //WritableSignal<Jeocode | undefined> {
        console.log('Prodweather - getJeoCodeByUnKnownZipSig and the incoming zip = ' + zip);
        //this.dummySig.set(new Date().getTime()+'');
        this.zzipSig.set(zip);
        //let result = this.jeoCodeProdResource.value;
        //return result;
    }  

    private zzipSig:WritableSignal<String | undefined>= signal(undefined);
    jeoCodeProdResource = httpResource<Jeocode | undefined> (() => {
        const zip = this.zzipSig();
        //const dummy = this.dummySig();
        //if (!zip || !dummy ){ console.log('Prodweather - jeoCodeProdResource -  zip or dummy is not defined - returning undefined..'); return undefined; }
        if (!zip ){ console.log('Prodweather - jeoCodeProdResource -  zip is not defined - returning undefined..'); return undefined; }
        else{
            return {
                url:'https://api.openweathermap.org/geo/1.0/zip?zip='+zip+',us&units=imperial&appid=' + this.wAppId,
                method:'GET'
            }
        }
    });

/*
    getJeoCodeByUnKnownZipSig(zipSig: WritableSignal<String | undefined>): WritableSignal<Jeocode | undefined> {
      console.log('Prodweather going for getJeoCodeByUnKnownZipSig with zip ' + zipSig());  
      //let result = httpResource<Jeocode>( ()=>'https://api.openweathermap.org/geo/1.0/zip?zip=' + '93727' + ',us&units=imperial&appid='+this.wAppId);
      const result = httpResource<Jeocode>(
      () => 'https://api.openweathermap.org/geo/1.0/zip?zip='+zipSig()+',us&units=imperial&appid=' + this.wAppId,
      { injector: this.injector }
      );
    return result.value;
  }
  */  
}
