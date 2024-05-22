import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { response } from 'express';
import { NgFor, NgIf } from '@angular/common';
import * as XLSX from 'xlsx';
import {jsPDF} from 'jspdf';
import html2canvas from 'html2canvas';
import { Subscription } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import moment from 'moment';
@Component({
  selector: 'app-show-all',
  standalone: true,
  imports: [HttpClientModule, NgFor, NgIf,ReactiveFormsModule, ],
  templateUrl: './show-all.component.html',
  template:   `{{input_search}}`,
  styleUrl: './show-all.component.css'
})
export class ShowAllComponent {
  personalInfo:any;
  name = new FormControl('');
  gender = new FormControl('');
  staff_id = new FormControl('');
  birthday = new FormControl('');
  isEdit = false;
  isAdd = false;
  notFound:boolean;
  not_found_msg:string;
  staffs :any;
  record : any;
  excelFileName : string = "StaffManagementBook.xlsx";
  pdfFileName : string = "StaffManagement.pdf";
  genders =[{id:1, name:'male'},{id:2, name:'female'}]
constructor(private dataService: DataService){
  this.notFound = false;
  this.not_found_msg = "";
  this.personalInfo = {};

}
GetAll(){
  this.dataService.getDataAll().subscribe(response=>{
    this.staffs = response.data.record;
    this.dataService.changeMessage(this.staffs)
    console.log(this.staffs);
    }); 
 }
 Close(){
  this.isEdit = false;
  this.isAdd = false;
 }
 Add(){
  this.isAdd = true;
 }
 AddConfirm(id:string){
  let birday = moment(this.birthday.value).format('YYYY-MM-DD');
  let gender = this.gender.value;
return this.dataService.Add({id:this.staff_id.value, name:this.name.value,gender:gender,birthday:birday}).subscribe((response=>{
console.log(response);
this.GetAll();
}))
}
EditConfirm(id:string){
  let birday = moment(this.birthday.value).format('YYYY-MM-DD');
  let gender = this.gender.value;
return this.dataService.Edit({id:id, name:this.name.value,gender:gender,birthday:birday}).subscribe((response=>{
console.log(response);
this.GetAll();
}))
}
ngDoCheck(){
  this.record = this.dataService.getStaffs();
  console.log(this.record + "construtor")
  console.log(this.record+"show")


  if(this.record.includes('msg')){
    this.notFound = true;
    this.not_found_msg = "Data Not Found";
  }else{
    this.record.forEach((r:any) => {
      r.birthday = moment(r.birthday).format("DD MMM YYYY");
    });
    this.staffs = this.record
  }
}
ngOnChange(){
  this.record = this.dataService.getStaffs();
  this.isEdit = this.dataService.getEdit()
  console.log(this.record + "construtor")
  console.log(this.record+"show")
  if(this.record.msg){
    this.staffs = this.record;
  }else{
    this.notFound = true;
    this.not_found_msg = "Data Not Found";
  }
}

 Edit(id:string){
  console.log("edit staff id: " + id);
  this.isEdit = true;
  // this.dataService.Edit(id).subscribe(response=>{
  //   this.staffs = response.data.record;
  //   console.log(response)
  // });
  this.dataService.Search(id).subscribe(response=>{
    this.personalInfo = response.data.record[0];
    this.personalInfo.birthday = moment(this.personalInfo.birthday).format("DD MMM YYYY");

  })
  console.log(JSON.stringify(this.personalInfo));
 };
 Delete(id:string){
  console.log('delete staff id: ' + id);
  this.dataService.Delete(id).subscribe(response=>{
   this.GetAll();
    console.log(response)
  });
 
  
 }
 ExportExcel(): void
 {
   /* pass here the table id */
   let element = document.getElementById('table-staff');
   const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

   /* generate workbook and add the worksheet */
   const wb: XLSX.WorkBook = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

   /* save to file */  
   XLSX.writeFile(wb, this.excelFileName);

 }
  ExportPDF(): void{
    let elementOfTable = document.getElementById('table-staff');
    html2canvas(elementOfTable!).then(canvas =>{
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF(
        'p','mm','a4'
      );
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save(this.pdfFileName);
    });
  }


}
