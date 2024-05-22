import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  template: `{{input_search}}`
})
export class HeaderComponent {
  title = "header";
  staffs : any;
  inputControl = new FormControl('');
  
  constructor(private dataService: DataService){
    this.GetAll()
  };


   Submit(){
    console.log("input value: "+ typeof this.inputControl.value)

    if(this.inputControl.value == ''){
      this.dataService.changeEdit(false);
      return this.GetAll();
    }else{
      this.dataService.changeEdit(false);
      this.dataService.Search(this.inputControl.value!).subscribe(response=>{
    
        let returnCode = response.returnCode;
        if(returnCode != 200){
          this.staffs = {msg: "Data Not Found"};
        }else{
          this.staffs = response.data.record;
          console.log("staff: " + JSON.stringify(response.data.record))
        }
        this.dataService.changeMessage(this.staffs);
        console.log(response.returnCode)
      })
    }
   }
   GetAll(){
    this.dataService.getDataAll().subscribe(response=>{
      this.staffs = response.data.record;
      this.dataService.changeMessage(this.staffs)
      console.log(this.staffs);
      }); 
   }


};
