import { Injectable, ElementRef } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx-js-style';
import * as XLSXS from 'sheetjs-style';
import { ExcelJson } from '../interfaces/excel-json';
import * as moment from "moment";

const EXCEL_EXTENSION = '.xlsx';
const CSV_EXTENSION = '.csv';
const CSV_TYPE = 'text/plain;charset=utf-8';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  constructor() { }

  /**
   * Creates excel from the table element reference.
   *
   * @param element DOM table element reference.
   * @param fileName filename to save as.
   */
  public exportTableElmToExcel(element: ElementRef, fileName: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element.nativeElement);
    // generate workbook and add the worksheet
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, ws, 'Sheet1');
    // save to file
    XLSX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);
  }

  /**
   * Creates XLSX option from the Json data. Use this to customise the sheet by adding arbitrary rows and columns.
   *
   * @param json Json data to create xlsx.
   * @param fileName filename to save as.
   */
  public exportJsonToExcel(json: ExcelJson[], fileName: string): void {
    // inserting first blank row
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      json[0].data,
      this.getOptions(json[0])
    );

    for (let i = 1, length = json.length; i < length; i++) {
      // adding a dummy row for separation
      XLSX.utils.sheet_add_json(
        worksheet,
        [{}],
        this.getOptions(
          {
            data: [],
            skipHeader: true
          }, -1)
      );
      XLSX.utils.sheet_add_json(
        worksheet,
        json[i].data,
        this.getOptions(json[i], -1)
      );
    }
    const workbook: XLSX.WorkBook = { Sheets: { Sheet1: worksheet }, SheetNames: ['Sheet1'] };
    // save to file
    XLSX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);
  }

  /**
   * Creates XLSX option from the Json data. Use this to customise style of fill in the sheet by adding arbitrary rows and columns.
   *
   * @param json Json data to create xlsx.
   * @param fileName filename to save as.
   */
  public exportJsonToExcelColor(json: ExcelJson[], fileName: string): void {
    //Declare json data values in array
    let array: any[] = json[0].data ;
    let arraycolumns:any[] = [];
    //Validate number of columns and assign the width of each column
    if(array[0]['L']){
      arraycolumns = ['A','B','C','D','E','F','G','H','I','J','K','L'];
    }else{
      arraycolumns = ['A','B','C','D','E','F','G'];
    }
    //Formatos para Titulos
    for (let j = 0, length = arraycolumns.length; j < length; j++){
      let col:any = arraycolumns[j];
      array[0][col] = {v:array[0][col],s:{font:{bold:true}}};
    }
    let arrayrows:any[] = [];
    //Assign column titles in worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      [array[0]],
      this.getOptions({ data:[], skipHeader:true}, -1)
    );
    //Validate number of columns and assign the width of each column
    if(array[0]['L']){
      worksheet["!cols"] = [{ width: 13 }, { width: 18 }, { width: 18 }, {width: 30 }, { width: 20 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 }];
    }else{
      worksheet["!cols"] = [{ width: 13 }, { width: 18 }, { width: 18 }, {width: 30 }, { width: 28 }, { width: 17 }, { width: 10 }];
    }
    //loop through the array and assign a color when they match
    for (let i = 1, length = array.length; i < length; i++) {
      for (let j = 0, length = arraycolumns.length; j < length; j++) {
        let col:any = arraycolumns[j];
        if(array[i][col]=='A'){
          array[i][col] = {v:array[i][col],s:{fill:{fgColor:{rgb:"c5e0b4"}}}};
          arrayrows.push(array[i][col]);
        }else if(array[i][col]=='F'){
          array[i][col] = {v:array[i][col],s:{fill:{fgColor:{rgb:"ffa3a3"}}}};
          arrayrows.push(array[i][col]);
        }else if(array[i][col]=='I'){
          array[i][col] = {v:array[i][col],s:{fill:{fgColor:{rgb:"d5b8ea"}}}};
          arrayrows.push(array[i][col]);
        }else if(array[i][col]=='D'){
          array[i][col] = {v:array[i][col],s:{fill:{fgColor:{rgb:"c8d6ee"}}}};
          arrayrows.push(array[i][col]);
        }else if(array[i][col]=='NL'){
          array[i][col] = {v:array[i][col],s:{fill:{fgColor:{rgb:"ffedb3"}}}};
          arrayrows.push(array[i][col]);
        }else{
          if(array[0][col]=='Hora_de_Entrada'){
            if(array[i][col]!=null){
              let fecha = moment(array[i][col]).format('h:mm a');
              array[i][col] = fecha;
              arrayrows.push(array[i][col]);
            }else{
              arrayrows.push(array[i][col]);
            }
          }else{
            arrayrows.push(array[i][col]);
          }
        }
      }
      //assign data from rows in worksheet
      XLSX.utils.sheet_add_json(
        worksheet,[arrayrows],
        this.getOptions({ data:[],skipHeader:true}, -1)
      );
      arrayrows = [];
    }
    const workbook: XLSX.WorkBook = { Sheets: { Sheet1: worksheet }, SheetNames: ['Sheet1'] };
    // save to file
    XLSX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);
  }

  public exportContratosColor(json: ExcelJson[], fileName: string): void {
    //Declare json data values in array
    let array: any[] = json[0].data ;
    let arraycolumns:any[] =['A','B','C','D','E','F','G','H','I','J','K'];
    //Formatos para Titulos
    for (let j = 0, length = arraycolumns.length; j < length; j++) {
      let col:any = arraycolumns[j];
      array[0][col] = {v:array[0][col],s:{font:{bold:true}}};
    }
    let arrayrows:any[] = [];
    //Assign column titles in worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      [array[0]],
      this.getOptions({ data:[], skipHeader:true}, -1)
    );
    worksheet["!cols"] = [
      {width:60},//A
      {width:18},//B
      {width:40},//C
      {width:14},//D
      {width:14},//E
      {width:16},//F
      {width:10},//G
      {width:10},//H
      {width:20},//I
      {width:50},//J
      {width:10}];//K
    //loop through the array and assign a color when they match
    for (let i = 1, length = array.length; i < length; i++) {
      for (let j = 0, length = arraycolumns.length; j < length; j++) {
        let col:any = arraycolumns[j];
        //array[i][col] = {v:array[i][col],s:{fill:{fgColor:{rgb:"ffedb3"}}}};
        if(array[i][col]!=null) {
          if (col == 'D' || col == 'E' || col == 'F') {
            array[i][col] = moment(array[i][col]).format('yyyy/MM/DD');
            array[i][col] = {v:array[i][col],s:{alignment:{vertical:'top'}}};
            arrayrows.push(array[i][col]);
          } else if(col == 'C' || col == 'J'){
            array[i][col] = {v:array[i][col],s:{alignment:{vertical:'top',wrapText:true}}};
            arrayrows.push(array[i][col]);
          }else{
            array[i][col] = {v:array[i][col],s:{alignment:{vertical:'top'}}};
            arrayrows.push(array[i][col]);
          }
        }else{
          arrayrows.push('');
        }
      }
      //assign data from rows in worksheet
      XLSX.utils.sheet_add_json(
        worksheet,[arrayrows],
        this.getOptions({ data:[],skipHeader:true}, -1)
      );
      arrayrows = [];
    }
    const workbook: XLSX.WorkBook = { Sheets: { Sheet1: worksheet}, SheetNames: ['Sheet1'] };
    /* Agregar nueva hoja de calculo
    const workbook: XLSX.WorkBook = { Sheets: { Sheet1: worksheet , Sheet2: worksheet}, SheetNames: ['Sheet1','Sheet2'] }; */
    // save to file
    XLSX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);
  }


  public exportMatrizColor(json: ExcelJson[], fileName: string): void {
    //Declare json data values in array
    let array: any[] = json[0].data ;
    let arraycolumns:any[] =['A','B','C','D','E'];
    //Formatos para Titulos
    for (let j = 0, length = arraycolumns.length; j < length; j++) {
      let col:any = arraycolumns[j];
      array[0][col] = {v:array[0][col],s:{font:{bold:true}}};
    }
    let arrayrows:any[] = [];
    //Assign column titles in worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      [array[0]],
      this.getOptions({ data:[], skipHeader:true}, -1)
    );
    worksheet["!cols"] = [
      {width:14},//A
      {width:30},//B
      {width:50},//C
      {width:10},//D
      {width:10}];//E
    //loop through the array and assign a color when they match
    for (let i = 1, length = array.length; i < length; i++) {
      for (let j = 0, length = arraycolumns.length; j < length; j++) {
        let col:any = arraycolumns[j];
        //array[i][col] = {v:array[i][col],s:{fill:{fgColor:{rgb:"ffedb3"}}}};
        if(array[i][col]!=null) {
          if (col == 'D') {
            if(array[i][col]=='Alta'){
              array[i][col] = {v:array[i][col],s:{fill:{fgColor:{rgb:"c5e0b4"}}}};
              arrayrows.push(array[i][col]);
            }else if(array[i][col]=='Baja'){
              array[i][col] = {v:array[i][col],s:{fill:{fgColor:{rgb:"ffa3a3"}}}};
              arrayrows.push(array[i][col]);
            }
          } else{
            arrayrows.push(array[i][col]);
          }
        }else{
          arrayrows.push('');
        }
      }
      //assign data from rows in worksheet
      XLSX.utils.sheet_add_json(
        worksheet,[arrayrows],
        this.getOptions({ data:[],skipHeader:true}, -1)
      );
      arrayrows = [];
    }
    const workbook: XLSX.WorkBook = { Sheets: { Sheet1: worksheet}, SheetNames: ['Sheet1'] };
    /* Agregar nueva hoja de calculo const workbook: XLSX.WorkBook = { Sheets: { Sheet1: worksheet , Sheet2: worksheet}, SheetNames: ['Sheet1','Sheet2'] }; */
    // save to file
    XLSX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);
  }
  /**
   * Creates XLSX option from the data.
   *
   * @param json Json data to create xlsx.
   * @param origin XLSX option origin.
   * @returns options XLSX options.
   */
  private getOptions(json: ExcelJson, origin?: number): any {
    // adding actual data
    const options = {
      skipHeader: true,
      origin: -1,
      header: Array<string>()
    };
    options.skipHeader = json.skipHeader ? json.skipHeader : false;
    if (!options.skipHeader && json.header && json.header.length) {
      options.header = json.header;
    }
    if (origin) {
      options.origin = origin ? origin : -1;
    }
    return options;
  }

  /**
   * Saves the file on client's machine via FileSaver library.
   *
   * @param buffer The data that need to be saved.
   * @param fileName File name to save as.
   * @param fileType File type to save as.
   */
  private saveAsFile(buffer: any, fileName: string, fileType: string): void {
    const data: Blob = new Blob([buffer], { type: fileType });
    FileSaver.saveAs(data, fileName);
  }

  /**
   * Creates an array of data to csv. It will automatically generate title row based on object keys.
   *
   * @param rows array of data to be converted to CSV.
   * @param fileName filename to save as.
   * @param columns array of object properties to convert to CSV. If skipped, then all object properties will be used for CSV.
   */
  public exportToCsv(rows: object[], fileName: string, columns?: string[]) {
    const separator = ',';
    const keys = Object.keys(rows[0]).filter(k => {
      if (columns?.length) {
        return columns.includes(k);
      } else {
        return true;
      }
    });
    const csvContent =
      keys.join(separator) +
      '\n' +
      rows.map((row: any) => {
        return keys.map(k => {
          let cell = row[k] === null || row[k] === undefined ? '' : row[k];
          cell = cell instanceof Date
            ? cell.toLocaleString()
            : cell.toString().replace(/"/g, '""');
          if (cell.search(/("|,|\n)/g) >= 0) {
            cell = `"${cell}"`;
          }
          return cell;
        }).join(separator);
      }).join('\n');
    this.saveAsFile(csvContent, `${fileName}${CSV_EXTENSION}`, CSV_TYPE);
  }

  public exportTrabajadoresColor(json: ExcelJson[], fileName: string): void {
    //Declare json data values in array
    let array: any[] = json[0].data ;
    let arraycolumns:any[] =['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R'];
    //Formatos para Titulos
    for (let j = 0, length = arraycolumns.length; j < length; j++) {
      let col:any = arraycolumns[j];
      array[0][col] = {v:array[0][col],s:{font:{bold:true}}};
    }
    let arrayrows:any[] = [];
    //Assign column titles in worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      [array[0]],
      this.getOptions({ data:[], skipHeader:true}, -1)
    );
    worksheet["!cols"] = [
      {width:6},//A
      {width:15},//B
      {width:20},//C
      {width:10},//D
      {width:10},//E
      {width:15},//F
      {width:19},//G
      {width:10},//H
      {width:10},//I
      {width:12},//J
      {width:20},//K
      {width:25},//L
      {width:20},//M
      {width:17},//N
      {width:20},//O
      {width:19},//P
      {width:60},//Q
      {width:20} //R
    ];

    //loop through the array and assign a color when they match
    for (let i = 1, length = array.length; i < length; i++) {
      for (let j = 0, length = arraycolumns.length; j < length; j++) {
        let col:any = arraycolumns[j];
        if(array[i][col]!=null) {
          if (col == 'G' || col == 'N' || col == 'O' || col == 'P') {
            array[i][col] = moment(array[i][col]).format('yyyy/MM/DD');
            arrayrows.push(array[i][col]);
          }else{
            arrayrows.push(array[i][col]);
          }
        }else{
          arrayrows.push('');
        }
      }
      //assign data from rows in worksheet
      XLSX.utils.sheet_add_json(
        worksheet,[arrayrows],
        this.getOptions({ data:[],skipHeader:true}, -1)
      );
      arrayrows = [];
    }
    const workbook: XLSX.WorkBook = { Sheets: { Sheet1: worksheet}, SheetNames: ['Sheet1'] };
    /* Agregar nueva hoja de calculo
    const workbook: XLSX.WorkBook = { Sheets: { Sheet1: worksheet , Sheet2: worksheet}, SheetNames: ['Sheet1','Sheet2'] }; */
    // save to file
    XLSX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);
  }

  public exportTIncapacidadesColor(json: ExcelJson[], fileName: string): void {
    let array: any[] = json[0].data ;
    let arraycolumns:any[] =['A','B','C','D','E','F'];
    for (let j = 0, length = arraycolumns.length; j < length; j++) {
      let col:any = arraycolumns[j];
      array[0][col] = {v:array[0][col],s:{font:{bold:true}}};
    }
    let arrayrows:any[] = [];
    //Assign column titles in worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      [array[0]],
      this.getOptions({ data:[], skipHeader:true}, -1)
    );
    worksheet["!cols"] = [
      {width:6},//A
      {width:30},//B
      {width:40},//C
      {width:40},//D
      {width:15},//E
      {width:15},//F
    ];

    //loop through the array and assign a color when they match
    for (let i = 1, length = array.length; i < length; i++) {
      for (let j = 0, length = arraycolumns.length; j < length; j++) {
        let col:any = arraycolumns[j];
        if(array[i][col]!=null) {
          if (col == 'E' || col == 'F' ) {
            array[i][col] = moment(array[i][col]).format('yyyy/MM/DD');
            arrayrows.push(array[i][col]);
          }else if (col == 'D') {
            array[i][col] = {v:array[i][col],s:{alignment:{vertical:'top',wrapText:true}}};
            arrayrows.push(array[i][col]);
          }else {
            arrayrows.push(array[i][col]);
          }
        }else{
          arrayrows.push('');
        }
      }
      XLSX.utils.sheet_add_json(
        worksheet,[arrayrows],
        this.getOptions({ data:[],skipHeader:true}, -1)
      );
      arrayrows = [];
    }
    const workbook: XLSX.WorkBook = { Sheets: { Sheet1: worksheet}, SheetNames: ['Sheet1'] };
    XLSX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);
  }

  public exportReporte(json: ExcelJson[], fileName: string): void {
    let array: any[] = json[0].data ;
    let arraycolumns:any[] =['A','B','C','D','E','F','G'];
    for (let j = 0, length = arraycolumns.length; j < length; j++) {
      let col:any = arraycolumns[j];
      array[0][col] = {v:array[0][col],s:{font:{bold:true}}};
    }
    let arrayrows:any[] = [];
    //Assign column titles in worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      [array[0]],
      this.getOptions({ data:[], skipHeader:true}, -1)
    );
    worksheet["!cols"] = [
      {width:6},//A
      {width:30},//B
      {width:20},//C
      {width:20},//D
      {width:25},//E
      {width:25},//F
      {width:15},//F
    ];
    //loop through the array and assign a color when they match
    for (let i = 1, length = array.length; i < length; i++) {
      for (let j = 0, length = arraycolumns.length; j < length; j++) {
        let col:any = arraycolumns[j];
        if(array[i][col]!=null) {
          arrayrows.push(array[i][col]);
        }else{
          if(col == 'D' && col == 'E' && col == 'F' && col == 'G') {
            arrayrows.push('0');
          }else{
            arrayrows.push('');
          }

        }
      }
      XLSX.utils.sheet_add_json(
        worksheet,[arrayrows],
        this.getOptions({ data:[],skipHeader:true}, -1)
      );
      arrayrows = [];
    }
    const workbook: XLSX.WorkBook = { Sheets: { Sheet1: worksheet}, SheetNames: ['Sheet1'] };
    XLSX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);
  }

  public exportPagos(json: ExcelJson[], fileName: string): void {
    let array: any[] = json[0].data ;
    let arraycolumns:any[] =['A','B','C','D','E','F'];
    for (let j = 0, length = arraycolumns.length; j < length; j++) {
      let col:any = arraycolumns[j];
      array[0][col] = {v:array[0][col],s:{font:{bold:true}}};
    }
    let arrayrows:any[] = [];
    //Assign column titles in worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      [array[0]],
      this.getOptions({ data:[], skipHeader:true}, -1)
    );
    worksheet["!cols"] = [
      {width:50},//A
      {width:30},//B
      {width:30},//C
      {width:30},//D
      {width:15},//E
      {width:15},//F
    ];
    //loop through the array and assign a color when they match
    for (let i = 1, length = array.length; i < length; i++) {
      for (let j = 0, length = arraycolumns.length; j < length; j++) {
        let col:any = arraycolumns[j];
        if(array[i][col]!=null) {
          arrayrows.push(array[i][col]);
        }else{
          arrayrows.push('');
        }
      }
      XLSX.utils.sheet_add_json(
        worksheet,[arrayrows],
        this.getOptions({ data:[],skipHeader:true}, -1)
      );
      arrayrows = [];
    }
    const workbook: XLSX.WorkBook = { Sheets: { Sheet1: worksheet}, SheetNames: ['Sheet1'] };
    XLSX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);
  }

  public exportEconomicReport(json: ExcelJson[], fileName: string): void {
    let array: any[] = json[0].data;

    let arraycolumns:any[] = [];
    let arrayrows:any[] = [];

    if(fileName.slice(0,20)=='Reporte de cuotas ob'){
      arraycolumns = ['A','B','C','D','E','F','G','H','I','J','K','L'];
    }else if(fileName.slice(0,20)=='Reporte de dias labo'){
      arraycolumns = ['A','B','C','D','E','F','G','H'];
    }else if(fileName.slice(0,20)=='Reporte de cuotas IM'){
      arraycolumns = ['A','B','C','D','E','F','G','H','I','J'];
    }else if(fileName.slice(0,20)=='Control de Entrega D'){
      arraycolumns = ['A','B','C','D','E','F','G','H','I','J','K','L'];
    }else if(fileName.slice(0,24)=='Control de contratos mat'){
      arraycolumns = ['A','B','C','D','E','F','G','H','I','J','K','L'];
    }else if(fileName.slice(0,24)=='Control de contratos res'){
      arraycolumns = ['A','B','C','D','E','F','G'];
    }else if(fileName.slice(0,20)=='Lista de trabajadore'){
      arraycolumns = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T'];
    }else if(fileName.slice(0,20)=='Matriz de altas y ba'){
      arraycolumns = ['A','B','C','D','E','F','G'];
    }else if(fileName.slice(0,22)=='Reporte asistencia dia'){
      arraycolumns = ['A','B','C','D','E','F','G','H','I'];
    }else if(fileName.slice(0,22)=='Reporte asistencia sem'){
      arraycolumns = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N'];
    }else if(fileName.slice(0,22)=='Reporte asistencia men'){
      arraycolumns = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N'];
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([array[0]],
      this.getOptions({ data:[], skipHeader:true}, -1)
    );

    if(fileName.slice(0,20)=='Reporte de cuotas ob'){
      worksheet["!cols"] = [
        {width:3},/*A*/{width:30},/*B*/{width:35},/*C*/{width:15},/*D*/{width:15},/*E*/{width:15},/*F*/{width:15},/*G*/
        {width:20},/*H*/{width:15},/*I*/{width:20},/*J*/{width:20},/*K*/{width:3},/*L*/
      ];
    }else if(fileName.slice(0,20)=='Reporte de dias labo'){
      worksheet["!cols"] = [
        {width:3},/*A*/{width:40},/*B*/{width:10},/*C*/{width:35},/*D*/{width:15},/*E*/{width:15},/*F*/{width:15},/*G*/
        {width:3},/*H*/
      ];
    }else if(fileName.slice(0,20)=='Reporte de cuotas IM'){
      worksheet["!cols"] = [
        {width:3},/*A*/{width:45},/*B*/{width:10},/*C*/{width:35},/*D*/{width:15},/*E*/{width:15},/*F*/{width:16},/*G*/
        {width:17},/*H*/{width:3},/*I*/
      ];
    }else if(fileName.slice(0,20)=='Control de Entrega D'){
      worksheet["!cols"] = [
        {width:3},/*A*/{width:45},/*B*/{width:32},/*C*/{width:45},/*D*/{width:12},/*E*/{width:18},/*F*/{width:15},/*G*/
        {width:12},/*H*/{width:17},/*I*/{width:12},/*J*/{width:12},/*K*/{width:3},/*L*/
      ];
    }else if(fileName.slice(0,24)=='Control de contratos mat'){
      worksheet["!cols"] = [
        {width:3},/*A*/{width:35},/*B*/{width:19},/*C*/{width:28},/*D*/{width:15},/*E*/{width:15},/*F*/{width:16},/*G*/
        {width:15},/*H*/{width:15},/*I*/{width:15},/*J*/{width:28},/*K*/{width:3},/*L*/
      ];
    }else if(fileName.slice(0,24)=='Control de contratos res'){
      worksheet["!cols"] = [
        {width:3},/*A*/{width:30},/*B*/{width:25},/*C*/{width:25},/*D*/{width:25},/*E*/{width:60},/*F*/{width:3},/*G*/
      ];
    }else if(fileName.slice(0,20)=='Control de contratos'){
      worksheet["!cols"] = [
        {width:3},/*A*/{width:35},/*B*/{width:21},/*C*/{width:28},/*D*/{width:15},/*E*/{width:15},/*F*/{width:16},/*G*/
        {width:15},/*H*/{width:15},/*I*/{width:15},/*J*/{width:28},/*K*/{width:3},/*L*/
      ];
    }else if(fileName.slice(0,20)=='Lista de trabajadore'){
      worksheet["!cols"] = [
        {width:3},/*A*/{width:45},/*B*/{width:7},/*C*/{width:20},/*D*/{width:25},/*E*/{width:14},/*F*/{width:14},/*G*/
        {width:14},/*H*/{width:20},/*I*/{width:12},/*J*/{width:28},/*K*/{width:15},/*L*/{width:15},/*M*/{width:15},/*N*/
        {width:19},/*O*/{width:19},/*P*/{width:21},/*Q*/{width:19},/*R*/{width:25},/*S*/{width:3},/*T*/
      ];
    }else if(fileName.slice(0,20)=='Matriz de altas y ba'){
      worksheet["!cols"] = [
        {width:3},/*A*/{width:50},/*B*/{width:15},/*C*/{width:40},/*D*/{width:25},/*E*/{width:25},/*F*/{width:3},/*G*/
      ];
    }else if(fileName.slice(0,22)=='Reporte asistencia dia'){
      worksheet["!cols"] = [
        {width:3},/*A*/{width:20},/*B*/{width:30},/*C*/{width:40},/*D*/{width:40},/*E*/{width:20},/*F*/{width:20},/*G*/
        {width:14},/*H*/{width:3},/*I*/
      ];
    }else if(fileName.slice(0,22)=='Reporte asistencia sem'){
      worksheet["!cols"] = [
        {width:3},/*A*/{width:20},/*B*/{width:30},/*C*/{width:30},/*D*/{width:30},/*E*/{width:25},/*F*/{width:12},/*G*/
        {width:12},/*H*/{width:12},/*I*/{width:12},/*J*/{width:12},/*K*/{width:12},/*L*/{width:12},/*M*/{width:3},/*N*/
      ];
    }else if(fileName.slice(0,22)=='Reporte asistencia men'){
      worksheet["!cols"] = [
        {width:3},/*A*/{width:20},/*B*/{width:30},/*C*/{width:30},/*D*/{width:30},/*E*/{width:20},/*F*/{width:20},/*G*/
        {width:15},/*H*/{width:15},/*I*/{width:15},/*J*/{width:12},/*K*/{width:15},/*L*/{width:15},/*M*/{width:3},/*N*/
      ];
    }

    if(fileName.slice(0,20)=='Reporte de cuotas ob'){
      for (let i = 1 , largo = array.length ; i < largo ; i++) {
        for (let j = 0 , ancho = arraycolumns.length ; j < ancho; j++) {
          let col:any = arraycolumns[j];
          if(array[i][col]!=null) {
            if(i==1){
              if(col=='B'){
                array[i][col] = {
                  v:'BR                         Management',
                  s:{
                    alignment:{horizontal:"left",vertical:"center",wrapText:true},
                    border: {
                      top:{style:"thick",color:{rgb:"2382C2"}},
                      bottom:{style:"thick",color:{rgb:"2382C2"}},
                      left:{style:"thick",color:{rgb:"2382C2"}},
                      right:{style:"thick",color:{rgb:"ffffff"}}
                    },
                    font:{name:'Poppins',sz:14,bold:true,color:{rgb:"2382C2"}}
                  }
                }
              }else if(col!='A' && col!='L'){
                array[i][col] = {
                  v:'REPORTE DE CUOTAS OBRERO PATRONALES            ',
                  s:{
                    alignment:{horizontal:"center"},
                    border: {
                      top:{style:"thick",color:{rgb:"2382C2"}},
                      bottom:{style:"thick",color:{rgb:"2382C2"}},
                      right:{style:"thick",color:{rgb:"2382C2"}}
                    },
                    font:{name:'Poppins',sz:26,bold:true,color:{rgb:"2382C2"}}
                  }
                }
              }
            }else if(i==2 && col!='A' && col!='L'){
              array[i][col] = {v:array[i][col],s:{font:{bold:true}}}
            }else if(i==3 && col!='A' && col!='L'){
              array[i][col] = {v:array[i][col],s:{font:{bold:true,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"2382C2"}}}}
            }else if(col=='H'){
              if(array[i][col]>0){ array[i][col] = {v:array[i][col],s:{fill:{fgColor:{rgb:"ffa3a3"}}}}; }
              else{ array[i][col] = {v:array[i][col],s:{fill:{fgColor:{rgb:"c5e0b4"}}} };}
            }else if(col=='K'){
              if(array[i][col]>0){ array[i][col] = {v:array[i][col],s:{fill:{fgColor:{rgb:"ffa3a3"}}}}; }
              else{ array[i][col] = {v:array[i][col],s:{fill:{fgColor:{rgb:"c5e0b4"}}}}; }
            }else{
              array[i][col] = {v:array[i][col],s:{alignment:{vertical:'top',horizontal:'left'}}};
            }
            arrayrows.push(array[i][col]);
          }else{
            arrayrows.push('');
          }
        }
        XLSX.utils.sheet_add_json(worksheet,[arrayrows],this.getOptions({ data:[],skipHeader:true}, -1));
        arrayrows = [];
      }
    }else if(fileName.slice(0,20)=='Reporte de dias labo'){
      for (let i = 1 , largo = array.length ; i < largo ; i++) {
        for (let j = 0 , ancho = arraycolumns.length ; j < ancho; j++) {
          let col:any = arraycolumns[j];
          if(array[i][col]!=null) {
            if(i==1){
              if(col=='B'){
                array[i][col] = {
                  v:'BR                                                  Management',
                  s:{
                    alignment:{horizontal:"left",vertical:"center",wrapText:true},
                    border: {
                      top:{style:"thick",color:{rgb:"2382C2"}},
                      bottom:{style:"thick",color:{rgb:"2382C2"}},
                      left:{style:"thick",color:{rgb:"2382C2"}},
                      right:{style:"thick",color:{rgb:"ffffff"}}
                    },
                    font:{name:'Poppins',sz:14,bold:true,color:{rgb:"2382C2"}}
                  }
                }
              }else if(col!='A' && col!='H'){
                array[i][col] = {
                  v:'REPORTE DE DIAS LABORADOS      ',
                  s:{
                    alignment:{horizontal:"left"},
                    border: {
                      top:{style:"thick",color:{rgb:"2382C2"}},
                      bottom:{style:"thick",color:{rgb:"2382C2"}},
                      right:{style:"thick",color:{rgb:"2382C2"}}
                    },
                    font:{name:'Poppins',sz:26,bold:true,color:{rgb:"2382C2"}}
                  }
                }
              }
            }else if(i==2 && col!='A' && col!='H'){
              array[i][col] = {v:array[i][col],s:{font:{bold:true}}}
            }else if(i==3 && col!='A' && col!='H'){
              array[i][col] = {v:array[i][col],s:{font:{bold:true,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"2382C2"}}}}
            }else{
              array[i][col] = {v:array[i][col],s:{alignment:{vertical:'top',horizontal:'left'}}};
            }
            arrayrows.push(array[i][col]);
          }else{
            arrayrows.push('');
          }
        }
        XLSX.utils.sheet_add_json(worksheet,[arrayrows],this.getOptions({ data:[],skipHeader:true}, -1));
        arrayrows = [];
      }
    }else if(fileName.slice(0,20)=='Reporte de cuotas IM'){
      for (let i = 1 , largo = array.length ; i < largo ; i++) {
        for (let j = 0 , ancho = arraycolumns.length ; j < ancho; j++) {
          let col:any = arraycolumns[j];
          if(array[i][col]!=null) {
            if(i==1){
              if(col=='B'){
                array[i][col] = {
                  v:'BR                                                Management',
                  s:{
                    alignment:{horizontal:"left",vertical:"center",wrapText:true},
                    border: {
                      top:{style:"thick",color:{rgb:"2382C2"}},
                      bottom:{style:"thick",color:{rgb:"2382C2"}},
                      left:{style:"thick",color:{rgb:"2382C2"}},
                      right:{style:"thick",color:{rgb:"ffffff"}}
                    },
                    font:{name:'Poppins',sz:14,bold:true,color:{rgb:"2382C2"}}
                  }
                }
              }else if(col!='A' && col!='I'){
                array[i][col] = {
                  v:'REPORTE DE CUOTAS IMSS       ',
                  s:{
                    alignment:{horizontal:"left"},
                    border: {
                      top:{style:"thick",color:{rgb:"2382C2"}},
                      bottom:{style:"thick",color:{rgb:"2382C2"}},
                      right:{style:"thick",color:{rgb:"2382C2"}}
                    },
                    font:{name:'Poppins',sz:26,bold:true,color:{rgb:"2382C2"}}
                  }
                }
              }
            }else if(i==2 && col!='A' && col!='I'){
              array[i][col] = {v:array[i][col],s:{font:{bold:true}}}
            }else if(i==3 && col!='A' && col!='I'){
              array[i][col] = {v:array[i][col],s:{font:{bold:true,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"2382C2"}}}}
            }else{
              array[i][col] = {v:array[i][col],s:{alignment:{vertical:'top',horizontal:'left'}}};
            }
            arrayrows.push(array[i][col]);
          }else{
            arrayrows.push('');
          }
        }
        XLSX.utils.sheet_add_json(worksheet,[arrayrows],this.getOptions({ data:[],skipHeader:true}, -1));
        arrayrows = [];
      }
    }else if(fileName.slice(0,20)=='Control de Entrega D'){
      for (let i = 1 , largo = array.length ; i < largo ; i++) {
        for (let j = 0 , ancho = arraycolumns.length ; j < ancho; j++) {
          let col:any = arraycolumns[j];
          if(array[i][col]!=null) {
            if(i==1){
              if(col=='B'){
                array[i][col] = {
                  v:'BR                                                         Management',
                  s:{
                    alignment:{horizontal:"left",vertical:"center",wrapText:true},
                    border: {
                      top:{style:"thick",color:{rgb:"2382C2"}},
                      bottom:{style:"thick",color:{rgb:"2382C2"}},
                      left:{style:"thick",color:{rgb:"2382C2"}},
                      right:{style:"thick",color:{rgb:"ffffff"}}
                    },
                    font:{name:'Poppins',sz:14,bold:true,color:{rgb:"2382C2"}}
                  }
                }
              }else if(col!='A' && col!='L'){
                array[i][col] = {
                  v:'CONTROL DE ENTREGA DOCUMENTAL               ',
                  s:{
                    alignment:{horizontal:"center"},
                    border: {
                      top:{style:"thick",color:{rgb:"2382C2"}},
                      bottom:{style:"thick",color:{rgb:"2382C2"}},
                      right:{style:"thick",color:{rgb:"2382C2"}}
                    },
                    font:{name:'Poppins',sz:26,bold:true,color:{rgb:"2382C2"}}
                  }
                }
              }
            }else if(i==2 && col!='A' && col!='L'){
              array[i][col] = {v:array[i][col],s:{font:{bold:true}}}
            }else if(i==3 && col!='A' && col!='L'){
              array[i][col] = {v:array[i][col],s:{font:{bold:true,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"2382C2"}}}}
            }else{
              array[i][col] = {v:array[i][col],s:{alignment:{vertical:'top',horizontal:'left'}}};
            }
            arrayrows.push(array[i][col]);
          }else{
            arrayrows.push('');
          }
        }
        XLSX.utils.sheet_add_json(worksheet,[arrayrows],this.getOptions({ data:[],skipHeader:true}, -1));
        arrayrows = [];
      }
    }else if(fileName.slice(0,24)=='Control de contratos mat'){
      for (let i = 1 , largo = array.length ; i < largo ; i++) {
        for (let j = 0 , ancho = arraycolumns.length ; j < ancho; j++) {
          let col:any = arraycolumns[j];
          if(array[i][col]!=null) {
            if(i==1){
              if(col=='B'){
                array[i][col] = {
                  v:'BR                                                         Management',
                  s:{
                    alignment:{horizontal:"left",vertical:"center",wrapText:true},
                    border: {
                      top:{style:"thick",color:{rgb:"2382C2"}},
                      bottom:{style:"thick",color:{rgb:"2382C2"}},
                      left:{style:"thick",color:{rgb:"2382C2"}},
                      right:{style:"thick",color:{rgb:"ffffff"}}
                    },
                    font:{name:'Poppins',sz:14,bold:true,color:{rgb:"2382C2"}}
                  }
                }
              }else if(col!='A' && col!='L'){
                array[i][col] = {
                  v:'CONTROL DE CONTRATOS MATRIZ DE CONTROL                         ',
                  s:{
                    alignment:{horizontal:"center"},
                    border: {
                      top:{style:"thick",color:{rgb:"2382C2"}},
                      bottom:{style:"thick",color:{rgb:"2382C2"}},
                      right:{style:"thick",color:{rgb:"2382C2"}}
                    },
                    font:{name:'Poppins',sz:26,bold:true,color:{rgb:"2382C2"}}
                  }
                }
              }
            }else if(i==2 && col!='A' && col!='L'){
              array[i][col] = {v:array[i][col],s:{font:{bold:true}}}
            }else if(i==3 && col!='A' && col!='L'){
              array[i][col] = {v:array[i][col],s:{font:{bold:true,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"2382C2"}}}}
            }else{
              array[i][col] = {v:array[i][col],s:{alignment:{vertical:'top',horizontal:'left',wrapText:true}}};
            }
            arrayrows.push(array[i][col]);
          }else{
            arrayrows.push('');
          }
        }
        XLSX.utils.sheet_add_json(worksheet,[arrayrows],this.getOptions({ data:[],skipHeader:true}, -1));
        arrayrows = [];
      }
    }else if(fileName.slice(0,24)=='Control de contratos res'){
      for (let i = 1 , largo = array.length ; i < largo ; i++) {
        for (let j = 0 , ancho = arraycolumns.length ; j < ancho; j++) {
          let col:any = arraycolumns[j];
          if(array[i][col]!=null) {
            if(i==1){
              if(col=='B'){
                array[i][col] = {
                  v:'BR                                                              Management',
                  s:{
                    alignment:{horizontal:"left",vertical:"center",wrapText:true},
                    border: {
                      top:{style:"thick",color:{rgb:"2382C2"}},
                      bottom:{style:"thick",color:{rgb:"2382C2"}},
                      left:{style:"thick",color:{rgb:"2382C2"}},
                      right:{style:"thick",color:{rgb:"ffffff"}}
                    },
                    font:{name:'Poppins',sz:14,bold:true,color:{rgb:"2382C2"}}
                  }
                }
              }else if(col!='A' && col!='G'){
                array[i][col] = {
                  v:'CONTROL DE CONTRATOS RESUMEN DE CUMPLIMIENTO',
                  s:{
                    alignment:{horizontal:"left"},
                    border: {
                      top:{style:"thick",color:{rgb:"2382C2"}},
                      bottom:{style:"thick",color:{rgb:"2382C2"}},
                      right:{style:"thick",color:{rgb:"2382C2"}}
                    },
                    font:{name:'Poppins',sz:26,bold:true,color:{rgb:"2382C2"}}
                  }
                }
              }
            }else if(i==2 && col!='A' && col!='G'){
              array[i][col] = {v:array[i][col],s:{font:{bold:true}}}
            }else if(i==3 && col!='A' && col!='G'){
              array[i][col] = {v:array[i][col],s:{font:{bold:true,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"2382C2"}}}}
            }else{
              array[i][col] = {v:array[i][col],s:{alignment:{vertical:'top',horizontal:'left',wrapText:true}}};
            }
            arrayrows.push(array[i][col]);
          }else{
            arrayrows.push('');
          }
        }
        XLSX.utils.sheet_add_json(worksheet,[arrayrows],this.getOptions({ data:[],skipHeader:true}, -1));
        arrayrows = [];
      }
    }else if(fileName.slice(0,20)=='Lista de trabajadore'){
      for (let i = 1 , largo = array.length ; i < largo ; i++) {
        for (let j = 0 , ancho = arraycolumns.length ; j < ancho; j++) {
          let col:any = arraycolumns[j];
          if(array[i][col]!=null) {
            if(i==1){
              if(col=='B'){
                array[i][col] = {
                  v:'BR                                                           Management',
                  s:{
                    alignment:{horizontal:"left",vertical:"center",wrapText:true},
                    border: {
                      top:{style:"thick",color:{rgb:"2382C2"}},
                      bottom:{style:"thick",color:{rgb:"2382C2"}},
                      left:{style:"thick",color:{rgb:"2382C2"}},
                      right:{style:"thick",color:{rgb:"ffffff"}}
                    },
                    font:{name:'Poppins',sz:14,bold:true,color:{rgb:"2382C2"}}
                  }
                }
              }else if(col!='A' && col!='T'){
                array[i][col] = {
                  v:'LISTA DE TRABAJADORES              ',
                  s:{
                    alignment:{horizontal:"center"},
                    border: {
                      top:{style:"thick",color:{rgb:"2382C2"}},
                      bottom:{style:"thick",color:{rgb:"2382C2"}},
                      right:{style:"thick",color:{rgb:"2382C2"}}
                    },
                    font:{name:'Poppins',sz:26,bold:true,color:{rgb:"2382C2"}}
                  }
                }
              }
            }else if(i==2 && col!='A' && col!='T'){
              array[i][col] = {v:array[i][col],s:{font:{bold:true}}}
            }else if(i==3 && col!='A' && col!='T'){
              array[i][col] = {v:array[i][col],s:{font:{bold:true,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"2382C2"}}}}
            }else{
              array[i][col] = {v:array[i][col],s:{alignment:{vertical:'top',horizontal:'left',wrapText:true}}};
            }
            arrayrows.push(array[i][col]);
          }else{
            arrayrows.push('');
          }
        }
        XLSX.utils.sheet_add_json(worksheet,[arrayrows],this.getOptions({ data:[],skipHeader:true}, -1));
        arrayrows = [];
      }
    }else if(fileName.slice(0,20)=='Matriz de altas y ba'){
      for (let i = 1 , largo = array.length ; i < largo ; i++) {
        for (let j = 0 , ancho = arraycolumns.length ; j < ancho; j++) {
          let col:any = arraycolumns[j];
          if(array[i][col]!=null) {
            if(i==1){
              if(col=='B'){
                array[i][col] = {
                  v:'BR                                                                Management',
                  s:{
                    alignment:{horizontal:"left",vertical:"center",wrapText:true},
                    border: {
                      top:{style:"thick",color:{rgb:"2382C2"}},
                      bottom:{style:"thick",color:{rgb:"2382C2"}},
                      left:{style:"thick",color:{rgb:"2382C2"}},
                      right:{style:"thick",color:{rgb:"ffffff"}}
                    },
                    font:{name:'Poppins',sz:14,bold:true,color:{rgb:"2382C2"}}
                  }
                }
              }else if(col!='A' && col!='G'){
                array[i][col] = {
                  v:'MATRIZ DE ALTAS Y BAJAS',
                  s:{
                    alignment:{horizontal:"left"},
                    border: {
                      top:{style:"thick",color:{rgb:"2382C2"}},
                      bottom:{style:"thick",color:{rgb:"2382C2"}},
                      right:{style:"thick",color:{rgb:"2382C2"}}
                    },
                    font:{name:'Poppins',sz:26,bold:true,color:{rgb:"2382C2"}}
                  }
                }
              }
            }else if(i==2 && col!='A' && col!='G'){
              array[i][col] = {v:array[i][col],s:{font:{bold:true}}}
            }else if(i==3 && col!='A' && col!='G'){
              array[i][col] = {v:array[i][col],s:{font:{bold:true,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"2382C2"}}}}
            }else{
              array[i][col] = {v:array[i][col],s:{alignment:{vertical:'top',horizontal:'left',wrapText:true}}};
            }
            arrayrows.push(array[i][col]);
          }else{
            arrayrows.push('');
          }
        }
        XLSX.utils.sheet_add_json(worksheet,[arrayrows],this.getOptions({ data:[],skipHeader:true}, -1));
        arrayrows = [];
      }
    }
    else if(fileName.slice(0,22)=='Reporte asistencia dia'){
      for (let i = 1 , largo = array.length ; i < largo ; i++) {
        for (let j = 0 , ancho = arraycolumns.length ; j < ancho; j++) {
          let col:any = arraycolumns[j];
          if(array[i][col]!=null) {
            if(i==1){
              if(col=='B'){
                array[i][col] = {
                  v:'BR          Management',
                  s:{
                    alignment:{horizontal:"left",vertical:"center",wrapText:true},
                    border: {
                      top:{style:"thick",color:{rgb:"2382C2"}},
                      bottom:{style:"thick",color:{rgb:"2382C2"}},
                      left:{style:"thick",color:{rgb:"2382C2"}},
                      right:{style:"thick",color:{rgb:"ffffff"}}
                    },
                    font:{name:'Poppins',sz:14,bold:true,color:{rgb:"2382C2"}}
                  }
                }
              }else if(col!='A' && col!='I'){
                array[i][col] = {
                  v:'CONTROL DE ASISTENCIA DIARIA       ',
                  s:{
                    alignment:{horizontal:"center",vertical:"center"},
                    border: {
                      top:{style:"thick",color:{rgb:"2382C2"}},
                      bottom:{style:"thick",color:{rgb:"2382C2"}},
                      right:{style:"thick",color:{rgb:"2382C2"}}
                    },
                    font:{name:'Poppins',sz:26,bold:true,color:{rgb:"2382C2"}}
                  }
                }
              }
            }else if(i==2 && col!='A' && col!='I'){
              array[i][col] = {v:array[i][col],s:{font:{bold:true}}}
            }else if(i==3 && col!='A' && col!='I'){
              array[i][col] = {v:array[i][col],s:{font:{bold:true,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"2382C2"}}}}
            }else if(col=='H'){
              if(array[i][col]=='A'){
                array[i][col] = {v:array[i][col],s:{alignment:{vertical:'top',horizontal:'center'},
                    font:{color:{rgb:"000000"}},fill:{fgColor:{rgb:"c5e0b4"}}}}
              }else if(array[i][col]=='F'){
                array[i][col] = {v:array[i][col],s:{alignment:{vertical:'top',horizontal:'center'},
                    font:{color:{rgb:"000000"}},fill:{fgColor:{rgb:"ffa3a3"}}}}
              }else if(array[i][col]=='I'){
                array[i][col] = {v:array[i][col],s:{alignment:{vertical:'top',horizontal:'center'},
                    font:{color:{rgb:"000000"}},fill:{fgColor:{rgb:"d5b8ea"}}}}
              }else if(array[i][col]=='D'){
                array[i][col] = {v:array[i][col],s:{alignment:{vertical:'top',horizontal:'center'},
                    font:{color:{rgb:"000000"}},fill:{fgColor:{rgb:"c8d6ee"}}}}
              }else if(array[i][col]=='NL'){
                array[i][col] = {v:array[i][col],s:{alignment:{vertical:'top',horizontal:'center'},
                    font:{color:{rgb:"000000"}},fill:{fgColor:{rgb:"ffedb3"}}}}
              }
            }else{
              array[i][col] = {v:array[i][col],s:{alignment:{vertical:'top',horizontal:'left'}}};
            }
            arrayrows.push(array[i][col]);
          }else{
            arrayrows.push('');
          }
        }
        XLSX.utils.sheet_add_json(worksheet,[arrayrows],this.getOptions({ data:[],skipHeader:true}, -1));
        arrayrows = [];
      }
    }else if(fileName.slice(0,22)=='Reporte asistencia sem'){
      for (let i = 1 , largo = array.length ; i < largo ; i++) {
        for (let j = 0 , ancho = arraycolumns.length ; j < ancho; j++) {
          let col:any = arraycolumns[j];
          if(array[i][col]!=null) {
            if(i==1){
              if(col=='B'){
                array[i][col] = {
                  v:'BR          Management',
                  s:{
                    alignment:{horizontal:"left",vertical:"center",wrapText:true},
                    border: {
                      top:{style:"thick",color:{rgb:"2382C2"}},
                      bottom:{style:"thick",color:{rgb:"2382C2"}},
                      left:{style:"thick",color:{rgb:"2382C2"}},
                      right:{style:"thick",color:{rgb:"ffffff"}}
                    },
                    font:{name:'Poppins',sz:14,bold:true,color:{rgb:"2382C2"}}
                  }
                }
              }else if(col!='A' && col!='N'){
                array[i][col] = {
                  v:'CONTROL DE ASISTENCIA SEMANAL',
                  s:{
                    alignment:{horizontal:"center"},
                    border: {
                      top:{style:"thick",color:{rgb:"2382C2"}},
                      bottom:{style:"thick",color:{rgb:"2382C2"}},
                      right:{style:"thick",color:{rgb:"2382C2"}}
                    },
                    font:{name:'Poppins',sz:26,bold:true,color:{rgb:"2382C2"}}
                  }
                }
              }
            }else if(i==2 && col!='A' && col!='N'){
              array[i][col] = {v:array[i][col],s:{font:{bold:true}}}
            }else if(i==3 && col!='A' && col!='N'){
              array[i][col] = {v:array[i][col],s:{font:{bold:true,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"2382C2"}}}}
            }else if(col=='G' || col=='H' || col=='I' || col=='J' || col=='K' || col=='L' || col=='M'){
              if(array[i][col]=='A'){
                array[i][col] = {v:array[i][col],s:{alignment:{vertical:'top',horizontal:'center'},
                    font:{color:{rgb:"000000"}},fill:{fgColor:{rgb:"c5e0b4"}}}}
              }else if(array[i][col]=='F'){
                array[i][col] = {v:array[i][col],s:{alignment:{vertical:'top',horizontal:'center'},
                    font:{color:{rgb:"000000"}},fill:{fgColor:{rgb:"ffa3a3"}}}}
              }else if(array[i][col]=='I'){
                array[i][col] = {v:array[i][col],s:{alignment:{vertical:'top',horizontal:'center'},
                    font:{color:{rgb:"000000"}},fill:{fgColor:{rgb:"d5b8ea"}}}}
              }else if(array[i][col]=='D'){
                array[i][col] = {v:array[i][col],s:{alignment:{vertical:'top',horizontal:'center'},
                    font:{color:{rgb:"000000"}},fill:{fgColor:{rgb:"c8d6ee"}}}}
              }else if(array[i][col]=='NL'){
                array[i][col] = {v:array[i][col],s:{alignment:{vertical:'top',horizontal:'center'},
                    font:{color:{rgb:"000000"}},fill:{fgColor:{rgb:"ffedb3"}}}}
              }
            }else{
              array[i][col] = {v:array[i][col],s:{alignment:{vertical:'top',horizontal:'left'}}};
            }
            arrayrows.push(array[i][col]);
          }else{
            arrayrows.push('');
          }
        }
        XLSX.utils.sheet_add_json(worksheet,[arrayrows],this.getOptions({ data:[],skipHeader:true}, -1));
        arrayrows = [];
      }
    }else if(fileName.slice(0,22)=='Reporte asistencia men'){
      for (let i = 1 , largo = array.length ; i < largo ; i++) {
        for (let j = 0 , ancho = arraycolumns.length ; j < ancho; j++) {
          let col:any = arraycolumns[j];
          if(array[i][col]!=null) {
            if(i==1){
              if(col=='B'){
                array[i][col] = {
                  v:'BR          Management',
                  s:{
                    alignment:{horizontal:"left",vertical:"center",wrapText:true},
                    border: {
                      top:{style:"thick",color:{rgb:"2382C2"}},
                      bottom:{style:"thick",color:{rgb:"2382C2"}},
                      left:{style:"thick",color:{rgb:"2382C2"}},
                      right:{style:"thick",color:{rgb:"ffffff"}}
                    },
                    font:{name:'Poppins',sz:14,bold:true,color:{rgb:"2382C2"}}
                  }
                }
              }else if(col!='A' && col!='N'){
                array[i][col] = {
                  v:'CONTROL DE ASISTENCIA MENSUAL',
                  s:{
                    alignment:{horizontal:"center"},
                    border: {
                      top:{style:"thick",color:{rgb:"2382C2"}},
                      bottom:{style:"thick",color:{rgb:"2382C2"}},
                      right:{style:"thick",color:{rgb:"2382C2"}}
                    },
                    font:{name:'Poppins',sz:26,bold:true,color:{rgb:"2382C2"}}
                  }
                }
              }
            }else if(i==2 && col!='A' && col!='N'){
              array[i][col] = {v:array[i][col],s:{font:{bold:true}}}
            }else if(i==3 && col!='A' && col!='N'){
              array[i][col] = {v:array[i][col],s:{font:{bold:true,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"2382C2"}}}}
            }else if(col=='G'){
              array[i][col] = {v:array[i][col],s:{alignment:{vertical:'top',horizontal:'center'},
                  font:{color:{rgb:"000000"}},fill:{fgColor:{rgb:"c5e0b4"}}}}
            }else if(col=='H'){
              array[i][col] = {v:array[i][col],s:{alignment:{vertical:'top',horizontal:'center'},
                  font:{color:{rgb:"000000"}},fill:{fgColor:{rgb:"ffa3a3"}}}}
            }else if(col=='I'){
              array[i][col] = {v:array[i][col],s:{alignment:{vertical:'top',horizontal:'center'},
                  font:{color:{rgb:"000000"}},fill:{fgColor:{rgb:"d5b8ea"}}}}
            }else if(col=='J'){
              array[i][col] = {v:array[i][col],s:{alignment:{vertical:'top',horizontal:'center'},
                  font:{color:{rgb:"000000"}},fill:{fgColor:{rgb:"c8d6ee"}}}}
            }else{
              array[i][col] = {v:array[i][col],s:{alignment:{vertical:'top',horizontal:'left'}}};
            }
            arrayrows.push(array[i][col]);
          }else{
            arrayrows.push('');
          }
        }
        XLSX.utils.sheet_add_json(worksheet,[arrayrows],this.getOptions({ data:[],skipHeader:true}, -1));
        arrayrows = [];
      }
    }

    if(fileName.slice(0,20)=='Reporte de cuotas ob'){
      worksheet["!merges"] = [{"s": {"r": 1, "c": 2},"e": {"r": 1, "c": 10}}]
    }else if(fileName.slice(0,20)=='Reporte de dias labo'){
      worksheet["!merges"] = [{"s": {"r": 1, "c": 2},"e": {"r": 1, "c": 6}}]
    }else if(fileName.slice(0,20)=='Reporte de cuotas IM'){
      worksheet["!merges"] = [{"s": {"r": 1, "c": 2},"e": {"r": 1, "c": 7}}]
    }else if(fileName.slice(0,20)=='Control de Entrega D'){
      worksheet["!merges"] = [{"s": {"r": 1, "c": 2},"e": {"r": 1, "c": 10}}]
    }else if(fileName.slice(0,24)=='Control de contratos mat'){
      worksheet["!merges"] = [{"s": {"r": 1, "c": 2},"e": {"r": 1, "c": 10}}]
    }else if(fileName.slice(0,24)=='Control de contratos res'){
      worksheet["!merges"] = [{"s": {"r": 1, "c": 2},"e": {"r": 1, "c": 5}}]
    }else if(fileName.slice(0,20)=='Lista de trabajadore'){
      worksheet["!merges"] = [{"s": {"r": 1, "c": 2},"e": {"r": 1, "c": 18}}]
    }else if(fileName.slice(0,20)=='Matriz de altas y ba'){
      worksheet["!merges"] = [{"s": {"r": 1, "c": 2},"e": {"r": 1, "c": 5}}]
    }else if(fileName.slice(0,22)=='Reporte asistencia dia'){
      worksheet["!merges"] = [{"s": {"r": 1, "c": 2},"e": {"r": 1, "c": 7}}]
    }else if(fileName.slice(0,22)=='Reporte asistencia sem'){
      worksheet["!merges"] = [{"s": {"r": 1, "c": 2},"e": {"r": 1, "c": 12}}]
    }else if(fileName.slice(0,22)=='Reporte asistencia men'){
      worksheet["!merges"] = [{"s": {"r": 1, "c": 2},"e": {"r": 1, "c": 12}}]
    }

    const workbook: XLSX.WorkBook = { Sheets: { Hoja1: worksheet}, SheetNames: ['Hoja1'] };
    XLSX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);
  }

  public exportDocumental(json: ExcelJson[], fileName: string): void {
    let array: any[] = json[0].data ;
    let arraycolumns:any[] =['A','B','C','D','E','F','G','H','I'];
    for (let j = 0, length = arraycolumns.length; j < length; j++) {
      let col:any = arraycolumns[j];
      array[0][col] = {v:array[0][col],s:{font:{bold:true}}};
    }
    let arrayrows:any[] = [];
    //Assign column titles in worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      [array[0]],
      this.getOptions({ data:[], skipHeader:true}, -1)
    );
    worksheet["!cols"] = [
      {width:40},//A
      {width:50},//B
      {width:15},//C
      {width:18},//D
      {width:15},//E
      {width:15},//F
      {width:18},//G
      {width:15},//H
      {width:15}//I
    ];
    //loop through the array and assign a color when they match
    for (let i = 1, length = array.length; i < length; i++) {
      for (let j = 0, length = arraycolumns.length; j < length; j++) {
        let col:any = arraycolumns[j];
        if(array[i][col]!=null) {
          if (col == 'G' || col == 'H' || col == 'I' ) {
            array[i][col] = moment(array[i][col]).format('yyyy/MM/DD');
            arrayrows.push(array[i][col]);
          }else{
            arrayrows.push(array[i][col]);
          }
        }else{
          arrayrows.push('');
        }
      }
      XLSX.utils.sheet_add_json(
        worksheet,[arrayrows],
        this.getOptions({ data:[],skipHeader:true}, -1)
      );
      arrayrows = [];
    }
    const workbook: XLSX.WorkBook = { Sheets: { Sheet1: worksheet}, SheetNames: ['Sheet1'] };
    XLSX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);
  }

}

