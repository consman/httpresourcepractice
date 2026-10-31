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
    lastJeoCodeSig: WritableSignal<Jeocode | undefined> = signal(undefined);
    jeoCodes: Jeocode [] = [];
    lastZipDone='';
    jeoCodesSigsSig: WritableSignal<WritableSignal<Jeocode | undefined> [] | undefined> = signal(new Array<WritableSignal<Jeocode| undefined>>);

    constructor(){
      this.jeoCodesSigsSig = this.getJeoCodesSigsSig();

      effect(() => { //001
        const totalJeoCodesSigsSigComp = this.getTotalJeoCodesSigsSigComp();
        const totalJeoCodesSigsSig = totalJeoCodesSigsSigComp();
        if(totalJeoCodesSigsSig && totalJeoCodesSigsSig.length > 0){
          let lastjeoSig = totalJeoCodesSigsSig[totalJeoCodesSigsSig.length-1];
          const lastJeo = lastjeoSig();
          if(lastJeo && lastJeo.zip.length == 5){
            this.lastJeoCodeSig.set(lastJeo);
            console.log('eff 001 saved last jeocode of this.getTotalJeoCodesSigsSigComp() to lastJeoCodeSig - zip = ' + lastJeo.zip );
          }
        }
      });

    }

    getTotalJeoCodesSigsSigComp = computed(():WritableSignal<WritableSignal<Jeocode | undefined> [] | undefined> => {
      const currZip = this.zipSig();
      //let result = signal(new Array<WritableSignal<Jeocode| undefined>>);
      const getJeoCodes = this.getJeoCodesSigsSig();
      console.log('inside getTotalJeoCodesSigsSigComp... A');
      if (!currZip) {
        console.log('inside getTotalJeoCodesSigsSigComp... B');
        return getJeoCodes;
      }
      
      const newJeoSig = this.weatherService.jeoCodeProdResource.value; 
      console.log('inside getTotalJeoCodesSigsSigComp... C and newJeoSig()?.zip = ' +newJeoSig()?.zip);

      const combineStepOneResult = this.getNewArraySigBasedOnArraySig(getJeoCodes) ;

      const combineStepTwoResult = this.addSignalToSignalofArrayofSignals(combineStepOneResult, newJeoSig) ;

    return newJeoSig && newJeoSig()?.zip?.length === 5 
      ? combineStepTwoResult
      : getJeoCodes;
    });// end comp


        addSignalToSignalofArrayofSignals(inArrSig :    WritableSignal<WritableSignal<Jeocode | undefined> [] | undefined>, 
                                      newJeoSig : WritableSignal<Jeocode | undefined>)
                            :WritableSignal<WritableSignal<Jeocode | undefined> [] | undefined>{
          let result = signal(new Array<WritableSignal<Jeocode| undefined>>); 
          //let resultB = signal(new Array<WritableSignal<Jeocode| undefined>>); 
          console.log('addSignalToSignalofArrayofSignals A running and newJeo()?.zip =  '+ newJeoSig()?.zip);
          const inArr = inArrSig();
          if(inArr && newJeoSig){
            const newJeo = newJeoSig();
            if(newJeo && newJeo.zip.length == 5 && inArr.length > 0 && result()){
              
              inArr.forEach(jeo=> {
                const je = jeo();
                if(je) {
                  result().push(signal(je));
                }
                else {
                  console.log('addSignalToSignalofArrayofSignals B je muwt be undefined.  '); 
                }
              });// end for each
              
            }  
            else {
              console.log('addSignalToSignalofArrayofSignals C this expression failed: (newJeo && newJeo.zip.length == 5 && inArr.length > 0 && result()) - newJeo?.zip '+ newJeo?.zip); 
            }
            result().push(signal(newJeo));
            
          }
          else{console.log('addSignalToSignalofArrayofSignals  C - inArr or  newJeoSig must be null here.');}
        console.log('addSignalToSignalofArrayofSignals finished and the result().length =  '+ result().length);
      return result;
    }

/*
    improveJeo(inJeo:WritableSignal<WritableSignal<Jeocode | undefined> [] | undefined>):WritableSignal<WritableSignal<Jeocode | undefined> [] | undefined>{
      const arr = inJeo();
      if(arr){
        let targetJeoSig = arr[arr.length-1];
        const targetJeo = targetJeoSig();
        if(targetJeo){
          console.log('before push ...');
          //this.jeoCodes.push(targetJeo);
          console.log('after push ...');
        }
      }
      return inJeo;
    }
*/

    getNewArraySigBasedOnArraySig(inArrSig :    WritableSignal<WritableSignal<Jeocode | undefined> [] | undefined>)
                            :WritableSignal<WritableSignal<Jeocode | undefined> [] | undefined>{
          let result = signal(new Array<WritableSignal<Jeocode| undefined>>); 
          //let resultB = signal(new Array<WritableSignal<Jeocode| undefined>>); 
          console.log('getNewArraySigBasedOnArraySig running ...')
          const inArr = inArrSig();
          if(inArr){                     
              inArr.forEach(jeo=> {
                result.update(arr => [
                  ...(arr || [])
                  , jeo
                ]);
              });// end for each             
          }
        console.log('getNewArraySigBasedOnArraySig finished and the result().length =  '+ result().length);
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
      this.weatherService.getJeoCodeByUnKnownZipSig(this.newZip);
      //this.jeoCodesSigsSig = this.getTotalJeoCodesSigsSigComp(); 
      this.newZip = '';
    }

}
