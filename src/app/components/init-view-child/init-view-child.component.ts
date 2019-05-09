import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';

declare var $;

@Component({
  selector: 'app-init-view-child',
  templateUrl: './init-view-child.component.html',
  styleUrls: ['./init-view-child.component.css']
})
export class InitViewChildComponent implements AfterViewInit, OnInit {

  @ViewChild('dataTable') table;
  dataTable: any;
  dataTableInstance: any;

  constructor(){
  }

  dtOptions: any = {};

  ngOnInit(): void {
    this.dtOptions = {
      ajax: 'assets/data/persons.json',
      columns: [{
        title: 'ID',
        data: 'id'
      }, {
        title: 'First name',
        data: 'firstName'
      }, {
        title: 'Last name',
        data: 'lastName'
      }, {
        title: 'Action',
        render: function (data: any, type: any, full: any) {
          const self = this;
          const id = full.id;

          return `<button type="button" class="btn btn-primary opt-edit">EDITAR</button>`;
        }
      }],
      drawCallback: (settings: any) => {

      },
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        // Unbind first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
        // $('td', row).unbind('click');
        // $('td', row).bind('click', () => {
        //   self.someClickHandler(data);
        // });

        // console.log(row, data);

        $(row).data(data);

        return row;
      }
    };
  
    this.dataTable = $(this.table.nativeElement);
    this.dataTableInstance =  this.dataTable.DataTable(this.dtOptions);
  }

  handlerClick(action: string, data: any){
    console.log(action, data);
  }

  ngAfterViewInit(): void {
    const _self = this;

    // _self.dataTable.on('click', '.opt-edit', (event: any) => {
    //     // const $element = $(event.target);
    //     // const $parent = $element.parents('tr');

    //     // _self.handlerClick('editar', $parent.data());

    //     console.log(this);
    // });

    _self.dataTable.on('click', '.opt-edit', function(event){
      console.log(this);
    });
  }
}
