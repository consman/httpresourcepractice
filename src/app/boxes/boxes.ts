import { Component, computed, effect, inject, Signal, signal, WritableSignal } from '@angular/core';
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
    jeoCodeSig: WritableSignal<Jeocode | undefined> = signal(undefined);
    jeoCodes: Jeocode [] = [];
    lastZipDone='';
    jeoCodesSigsSig: WritableSignal<WritableSignal<Jeocode | undefined> [] | undefined> = signal(new Array<WritableSignal<Jeocode| undefined>>);
    

    constructor(){
    }

    getTotalJeoCodesSigsSigComp = computed(():WritableSignal<WritableSignal<Jeocode | undefined> [] | undefined> => {
      const currZip = this.zipSig();
      //let result = signal(new Array<WritableSignal<Jeocode| undefined>>);
      const getJeoCodes = this.getJeoCodesSigsSig();
      const newJeoSig = this.weatherService.getJeoCodeByUnKnownZipSig((currZip+''));
      return currZip && newJeoSig && newJeoSig()?.zip.length == 5  
         ? this.addSignalToSignalofArrayofSignals( getJeoCodes, newJeoSig)  
          : getJeoCodes ;
    });// end comp

    addSignalToSignalofArrayofSignals(inArrSig :    WritableSignal<WritableSignal<Jeocode | undefined> [] | undefined>, 
                                      newJeo : WritableSignal<Jeocode | undefined>)
                            :WritableSignal<WritableSignal<Jeocode | undefined> [] | undefined>{
          let result = signal(new Array<WritableSignal<Jeocode| undefined>>); 
          console.log('addSignalToSignalofArrayofSignals running.. ');
          const inArr = inArrSig();
          if(inArr){
          inArr.forEach(jeo=> {
            result.update(arr => [
              ...(arr || [])
              , newJeo
            ]);
          });
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

    handleNewZip(): void{
      this.zipSig.set(this.newZip);      
      this.jeoCodesSigsSig = this.getTotalJeoCodesSigsSigComp(); 
      this.newZip = '';
    }

}
