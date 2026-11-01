import { Component, effect, inject, Signal, signal, WritableSignal } from '@angular/core';
import { Prodweather } from '../prodweather';
import { Jeocode } from '../funTypes';
import { FormsModule } from '@angular/forms';
import { Box } from '../box/box';

@Component({
  imports: [FormsModule, Box],
  selector: 'app-boxes',
  styleUrl: './boxes.css',
  templateUrl: './boxes.html',
})
export class Boxes {

    newZip!:string;
    weatherService = inject(Prodweather);
    zipSig: WritableSignal<String | undefined> = signal(undefined);
    lastJeoCodeSig: WritableSignal<Jeocode | undefined> = signal(undefined);
    jeoCodeSigFromService: WritableSignal<Jeocode | undefined> = signal(undefined);
    jeoCodes: Jeocode [] = [];
    lastZipDone='';
    jeoCodesSigsSig: WritableSignal<WritableSignal<Jeocode | undefined> [] | undefined> = signal(new Array<WritableSignal<Jeocode| undefined>>);
    inProgress:boolean = false;

    constructor(){
      this.jeoCodesSigsSig = this.getJeoCodesSigsSig();

      effect(() =>{ //001 
        const zipp = this.zipSig();
        if(zipp && zipp.length === 5){
          const currentGeoSig = this.weatherService.getJeoCode(zipp+'');
          const geo = currentGeoSig();
          //const geo = geoSig();
          if(geo && geo.zip.length == 5){
            console.log('eff 001 and the geo.name = '+geo.name);
            this.lastJeoCodeSig.set(geo);
            console.log('eff 001 saved this.weatherService.getJeoCode(zipp+ to this.lastJeoCodeSig - zip = ' + geo.zip );
              this.newZip = '';
          }
      }
      });
/*
      effect(() => {//001 
          const zipp = this.zipSig()          
          if(zipp){
            const jeoResultSigSig = this.getJeoCodeFromService; //this.weatherService.jeoCodeProdResource.value; 
            const jeoResultSig = jeoResultSigSig();
            const jeoResult = jeoResultSig()
            if(jeoResult && jeoResult.zip.length == 5){
                this.lastJeoCodeSig.set(jeoResult);
                console.log('eff 001 saved this.jeoCodeSigFromService() to this.lastJeoCodeSig - zip = ' + this.lastJeoCodeSig()?.zip );
                this.newZip = '';
            }
            else{
              console.log('eff 001 is not working ...');
            }
          }
          this.inProgress = false;
      }); //end effect 001
  */    
    }

    getJeoCodeFromService(): WritableSignal<Jeocode | undefined>{

      let result: WritableSignal<Jeocode | undefined> = signal(undefined);

      if(this.newZip != undefined && this.newZip.length == 5){
        this.jeoCodeSigFromService = this.weatherService.getJeoCode(this.newZip); // jeoCodeProdResource.value;
        console.log('getJeoCodeFromService() called and now this.jeoCodeSigFromService()?.name = '+ this.jeoCodeSigFromService()?.name )
        result = this.jeoCodeSigFromService; 
      }
      else{
        console.warn('getJeoCodeFromService called with a bad zip. returning undefined.');
        result =  signal(undefined);
      }
      return result;

    }

    getJeoCodesSigsSig ():WritableSignal<WritableSignal<Jeocode | undefined> [] | undefined>{
      let result = signal(new Array<WritableSignal<Jeocode| undefined>>);
      this.jeoCodes.forEach(jeo=> {
        result.update(arr => [
            ...(arr || [])
            , signal(jeo)
          ]);
      });
      return result;
    }
    
    handleSaved():void{
      const lastJeoCode = this.lastJeoCodeSig();
      if(lastJeoCode && lastJeoCode.zip.length == 5){
        this.jeoCodesSigsSig.update(arr => [...(arr || []), signal(lastJeoCode)]);
        console.log('handleSaved finished and the number of entries in this.jeoCodesSigsSig = ' + this.jeoCodesSigsSig()?.length);
      }
    }

    handleNewZip(): void{
      this.handleSaved();
      this.zipSig.set(this.newZip); 
      this.inProgress = true;     
      //this.jeoCodeSigFromService = this.weatherService.getJeoCode(this.newZip); //getJeoCodeByUnKnownZipSig(this.newZip);
      this.jeoCodeSigFromService = this.getJeoCodeFromService(); //this.weatherService.getJeoCode(this.newZip);
        //console.log('handleNewZip() called and now this.jeoCodeSigFromService()?.name = '+ this.jeoCodeSigFromService()?.name )
      //this.newZip = '';
    }

}
