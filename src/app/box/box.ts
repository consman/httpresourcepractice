import { Component, input } from '@angular/core';
import { Jeocode } from '../funTypes';
import { initialGeoCode } from '../refData';

@Component({
  imports: [],
  selector: 'app-box',
  styleUrl: './box.css',
  templateUrl: './box.html',
})
export class Box {

  jeoCodeSig = input<Jeocode | undefined>(initialGeoCode);
  //jeoc:(Jeocode | undefined)= undefined;
  
  constructor(){
    //const jeoc = this.jeoCodeSig();
    if(this.jeoCodeSig() && this.jeoCodeSig()?.zip.length ==5 ){
      console.log('Success. One box created for  '+this.jeoCodeSig()?.zip);
    }
  }
}
