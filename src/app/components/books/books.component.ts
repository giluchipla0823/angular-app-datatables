import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';

declare var $;


@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements AfterViewInit, OnInit {

  @ViewChild('dataTable') table;
  dataTable: any;
  dataTableInstance: any;

  dtOptions: any = {};

  constructor(){
  }

  ngOnInit() {
  	this.dtOptions = {
  	  initComplete: function(settings, json){
  	  	//console.log('initcomplete', json);

  	  	var $_api = this.api();

        console.log($_api);

        var tableId = settings.sTableId;
        var $_table = $('#' + tableId);
        var $_panel = $_table.parents('.panel');

        var $_containerLength = $_panel.find('.sel_dt_length');
        var $_containerInfo = $_panel.find('.info_dt_results');
        var $_containerPaginate = $_panel.find('.paginate_dt');

        $_containerLength.children().remove();
        $_containerInfo.children().remove();
        $_containerPaginate.children().remove();

        var $_datatableLength = $_panel.find('.dataTables_length');
        var $_datatableInfo = $_panel.find('.dataTables_info');
        var $_datatablePaginate = $_panel.find('.dataTables_paginate');

        $_datatableLength.appendTo($_containerLength);
        $_containerInfo.append($_datatableInfo);
        $_containerPaginate.append($_datatablePaginate);

  	  },
  	  dom: "<'hide'lt>tr<'hide'ip>",
  	  bFilter: false,
  	  lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, 'Todos']],
  	  serverSide: true,
  	  processing: true,
      ajax: {
        url: 'http://127.0.0.1:8000/api/books',
        method: 'GET',
        data: function(d){
        	d.listFormat = 'datatables';
        	d.includes = 'author,genres';
        },
        'dataFilter': function(response){
            var json = JSON.parse(response);                                        
            var data = json.data;

            return JSON.stringify({
                "draw": data.draw,
                "recordsTotal": data.recordsTotal,    
                "recordsFiltered": data.recordsFiltered,
                'data': data.items
            });
        },
        "dataSrc": function(data){
            if(data.data === undefined){
                return [];
            }

            return data.data;
        },
      },
      columns: [
	      {
	        title: 'ID',
	        data: 'id',
	        name: 'id',
	        className: 'dt-body-center'
	      }, 
	      {
	        title: 'Título',
	        data: 'title',
	        name: 'title'
	      }, 
	      {
	        title: 'Descripción',
	        data: 'description',
	        name: 'description'
	      },
	      {
	        title: 'Autor',
	        data: 'author',
	        name: 'author.name',
	        render: function (data: any, type: any, full: any) {
	        	return data.name;
	        }
	      },
	      {
	        title: 'Action',
	        render: function (data: any, type: any, full: any) {
	          const self = this;
	          const id = full.id;

	          return `<button type="button" class="btn btn-primary opt-edit">EDITAR</button>`;
	        }
	      }
      ],
      drawCallback: (settings: any) => {

      },
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        $(row).data(data);

        return row;
      }
    };
  
    this.dataTable = $(this.table.nativeElement);
    this.dataTableInstance =  this.dataTable.DataTable(this.dtOptions);
  }

  ngAfterViewInit(): void {
    const _self = this;

    _self.dataTable.on('click', '.opt-edit', function(event){
      const $this = $(this);
      const $row = $this.parents('tr[role="row"]');


      console.log(this, $row.data());
    });
  }

}
