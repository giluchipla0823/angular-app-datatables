import { AfterViewInit, Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import DatatablesHelper from '../../helpers/datatables.helper';
import swal from 'sweetalert';
import { Select2OptionData } from 'ng2-select2';

import { AuthorsService } from '../../services/authors/authors.service';

declare var $;

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements AfterViewInit, OnInit {
  
  @ViewChild('dataTable') table;
  @ViewChild('template') template;
  @ViewChild('selector') selector;

  public options: Select2Options;

  nested: any = {};

  authors: any = {
    data: [],
    selected: null
  }

  form: any = {
    data: {}
  };

  private _datatablesHelper: any = DatatablesHelper();

  public modalRef: BsModalRef;

  constructor(
    private modalService: BsModalService,
    private _authorsService: AuthorsService
  ) {
  }

  ngOnInit() {
    const vm = this;


    vm.getAuthors();

    this.options = {
      theme: 'bootstrap',
      placeholder: 'Seleccionar',
      allowClear: true,
      width: '100%',
      language: "es"
    }

  	this.nested.dtOptions = {
      'initComplete': this._datatablesHelper.initComplete,
  	  dom: this._datatablesHelper.renderDOM,
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

          for(const i in vm.form.data){
            const value = vm.form.data[i];

            if(value){
              d[i] = value;
            }
          }
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
  
    this.nested.dataTable = $(this.table.nativeElement);
    this.nested.dtInstance =  this.nested.dataTable.DataTable(this.nested.dtOptions);
  }

  getAuthors(){
    this._authorsService.getAuthors()
        .subscribe((response: any) => {
          const data = response.data;

          const authors: Array<Select2OptionData> = data.map((author: any, idx: number) => {
            return {
              id: author.id,
              text: author.name,
            }
          });

          this.authors.data = authors;

          setTimeout(() => {
            this.selector.element.val(null).trigger('change')

            this.eventChangeAuthor({
              value: null,
              data: []
            });
          }, 0); 
        });
  }

  eventChangeAuthor(e: any): void {
    const value = e.value;
    
    delete this.form.data.author;

    if(value){
      this.form.data.author = {
        id: value
      };
    }
  }

  ngAfterViewInit(): void {
    const vm = this;

    vm.nested.dataTable.on('click', '.opt-edit', function(event){
      const $this = $(this);
      const id = $this.data('id');
      const data = vm._datatablesHelper.getFilterData(vm.dtInstance, 'id', id);

      console.log('action edit', data);

      vm.openModal(data);
    });

    vm.nested.dataTable.on('click', '.opt-remove', function(event){
      const $this = $(this);
      const id = $this.data('id');
      const data = vm._datatablesHelper.getFilterData(vm.dtInstance, 'id', id);

      /*swal({
        title: "Confirmar",
        text: "¿Desea eliminar el libro seleccionado?",
        icon: "warning",
        buttons: true,
        dangerMode: true
      })
      .then((isConfirm) => {
        if (isConfirm) {
          swal("El libro seleccionado se ha eliminado correctamente", {
            icon: "success",
            title: 'Éxito'
          });
        }
      });*/
    });
  }

  reloadData(resetPaging: boolean): void{
    this._datatablesHelper.reloadData(this.nested.dtInstance, resetPaging);
  }

  openModal(data: any) {
    const title: string = data.id ? 'Editar libro' : 'Crear libro';

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


}
