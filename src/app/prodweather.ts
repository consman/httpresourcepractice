import { effect, inject, Injectable, Injector, signal, WritableSignal } from '@angular/core';
import { Jeocode } from './funTypes';
import { httpResource } from '@angular/common/http';

declare const W_APP_ID: string;

@Injectable({ providedIn: 'root' })
export class Prodweather {

    constructor(){
        effect(() => {
            const jeoCodeProdResourceValue = this.jeoCodeProdResource.value();
            console.log(' Resourse changed and jeoCodeProdResourceValue?.zip = ' + jeoCodeProdResourceValue?.zip);
        });
    }
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
            console.log('jeoCodeProdResource looking good ');
            return {
                
                url:'https://api.openweathermap.org/geo/1.0/zip?zip='+zip+',us&units=imperial&appid=' + this.wAppId,
                method:'GET'
            };
            
        }
    });

 
}
