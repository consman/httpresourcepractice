import { effect, inject, Injectable, Injector, signal, WritableSignal } from '@angular/core';
import { Jeocode } from './funTypes';
import { httpResource } from '@angular/common/http';
import { KNOWNGEOCODES } from './refData';

declare const W_APP_ID: string;

@Injectable({ providedIn: 'root' })
export class Prodweather {

    jeoResult:WritableSignal<Jeocode | undefined> = signal(undefined); //;

    constructor(){
        effect(() => {
            const jeoCodeProdResourceValue = this.jeoCodeProdResource.value();
            console.log(' Resource changed and jeoCodeProdResourceValue?.zip = ' + jeoCodeProdResourceValue?.zip);
        });
    }
    wAppId = W_APP_ID;
    dummySig:WritableSignal<String | undefined>= signal(new Date().getTime()+'');

    getJeoCode(zip: string): WritableSignal<Jeocode | undefined>{ // this would go in the abstract class 
        let result : WritableSignal<Jeocode | undefined> = signal(undefined);
        if (zip && zip.length == 5){ //This totally needs to be reworked
            const joeCodeKSig = this.getJeoCodeByKNOWNZipSig(zip);
            const jeoCodeK = joeCodeKSig();
            if ( jeoCodeK && jeoCodeK.zip.length == 5 ) {
                return joeCodeKSig;
            }
            else { // set the zip first then return the resource value
                this.zzipSig.set(zip);
                return  this.getJeoCodeByUnKnownZipSig(zip);
            }
        } else{
            console.warn('getJeoCode called with a bad zip - either undefined or not a length of 5 .');
        }

        if(result() == undefined){
            console.warn('Bummer unable to get the geoCode one way or another');
        }
        return result;      
    }
        

    getJeoCodeByKNOWNZipSig(zip: string): WritableSignal<Jeocode | undefined> { 
        let result : WritableSignal<Jeocode | undefined> = signal(undefined);
        if (zip && zip.length == 5){
            let jeoK = KNOWNGEOCODES.find(kgc =>(kgc.zip == zip));
            if(jeoK){
                console.log('success getJeoCodeByKNOWNZipSig found '+ zip);
                result = signal(jeoK);
            }
            else {
                console.log('getJeoCodeByKNOWNZipSig unable to get the geoCode from KNOWN - hoping to run getJeoCodeByUnKnownZipSig .');
                result = signal(undefined);
            }
        }
        else{
            console.warn('getJeoCodeByKNOWNZipSig called with a bad zip - either undefined or not a length of 5 .');
        }

    
        return result;   
    }

    getJeoCodeByUnKnownZipSig(zip: string): WritableSignal<Jeocode | undefined> { 
        console.log('\nProdweather - getJeoCodeByUnKnownZipSig and the incoming zip = ' + zip);
        this.jeoResult = this.jeoCodeProdResource.value;
        this.zzipSig.set(zip);
        return this.jeoCodeProdResource.value;
    }  

    private zzipSig:WritableSignal<String | undefined>= signal(undefined);
    jeoCodeProdResource = httpResource<Jeocode | undefined> (() => {
        const zip = this.zzipSig();
        if (!zip ){ console.log('Prodweather - jeoCodeProdResource -  zip is not defined - returning undefined..'); return undefined; }
        else{
            return {                
                url:'https://api.openweathermap.org/geo/1.0/zip?zip='+zip+',us&units=imperial&appid=' + this.wAppId,
                method:'GET'
            };
            
        }
    });

 
}
