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

    constructor(){
      this.jeoCodesSigsSig = this.getJeoCodesSigsSig();

      effect(() => {
        const jeoCodeFromServiceSig = this.getJeoCodeFromService();
        const jeoCodeFromService = jeoCodeFromServiceSig();
        if(jeoCodeFromService && jeoCodeFromService.zip.length == 5){
            this.lastJeoCodeSig.set(jeoCodeFromService);
            console.log('eff 001 saved this.jeoCodeSigFromService() to this.lastJeoCodeSig - zip = ' + this.lastJeoCodeSig()?.zip );
          }
      });
    }

    getJeoCodeFromService(): WritableSignal<Jeocode | undefined>{
      let tempSig = this.weatherService.jeoCodeProdResource.value;
      this.jeoCodeSigFromService = tempSig;
      return tempSig;  
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
      this.weatherService.getJeoCodeByUnKnownZipSig(this.newZip);
      this.newZip = '';
    }

}
