import { AfterViewInit, Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import datatablesHelper from '../../helpers/datatables.helper';

declare var $;

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements AfterViewInit, OnInit {
  
  @ViewChild('dataTable') table;
  @ViewChild('template') template;
  dataTable: any;
  dtInstance: any;
  dtOptions: any = {};

  form: any = {
    data: {}
  };

  private _datatablesHelper: any = datatablesHelper();

  public modalRef: BsModalRef;

  constructor(private modalService: BsModalService) {

  }

  ngOnInit() {
  	this.dtOptions = {
      'initComplete': this._datatablesHelper.initComplete,
  	  dom: '<\'hide\'lt><\'row\'<\'col-sm-12\'tr>><\'hide\'ip>',
  	  bFilter: false,
  	  lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, 'Todos']],
  	  serverSide: true,
  	  processing: true,
      responsive: true,
      ajax: {
        url: 'http://127.0.0.1:8000/api/books',
        method: 'GET',
        data: function(d) {
        	d.listFormat = 'datatables';
        	d.includes = 'author,genres';
        },
        'dataFilter': function(response) {
            const json = JSON.parse(response);
            const data = json.data;

            return JSON.stringify({
                'draw': data.draw,
                'recordsTotal': data.recordsTotal,
                'recordsFiltered': data.recordsFiltered,
                'data': data.items
            });
        },
        'dataSrc': function(data) {
            if (data.data === undefined) {
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
	        title: 'Acciones',
	        render: function (data: any, type: any, full: any) {
	          const self = this;
	          const id = full.id;

	          return `<button type="button" data-id="${id}" class="btn btn-primary opt-edit">
                      <i class="glyphicon glyphicon-edit"></i>
                    </button>
                    <button type="button" data-id="${id}" class="btn btn-danger opt-remove">
                      <i class="glyphicon glyphicon-trash"></i>
                    </button>`;
	        }
	      }
      ],
      drawCallback: (settings: any) => {

      },
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        
      }
    };
  
    this.dataTable = $(this.table.nativeElement);
    this.dtInstance =  this.dataTable.DataTable(this.dtOptions);
  }

  ngAfterViewInit(): void {
    const _self = this;

    _self.dataTable.on('click', '.opt-edit', function(event){
      const $this = $(this);
      const id = $this.data('id');
      const data = _self._datatablesHelper.getDataById(_self.dtInstance, id);

      console.log('action edit', data);

      _self.openModal(data);
    });

    _self.dataTable.on('click', '.opt-remove', function(event){
      const $this = $(this);
      const id = $this.data('id');
      const data = _self._datatablesHelper.getDataById(_self.dtInstance, id);

      console.log('action remove', data);
    });
  }

  openModal(data: any) {
    const title: string = data.id ? 'Editar libro' : 'Crear libro';

    this.form.data = data;

    this.modalRef = this.modalService.show(
      this.template, 
      {
         backdrop: 'static',
         keyboard: false 
      }
    );

    this.modalRef.content = {
      title: title,
      data: data
    }
  }

  cancel(){
    this.modalRef.hide();
  }

  accept(){
    console.log('Aceptando...', this.modalRef.content.data);
  }
}
