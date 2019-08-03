import { AfterViewInit, Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import DatatablesHelper from '../../helpers/datatables.helper';
import { Select2OptionData } from 'ng2-select2';
import { AuthorsService } from '../../services/authors/authors.service';
import 'sweetalert';
import { PublishersService } from '../../services/publishers/publishers.service';
import { BooksService } from '../../services/books/books.service';

declare var $;
declare var swal: any;

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements AfterViewInit, OnInit {
  
  @ViewChild('dataTable') table;
  @ViewChild('template') template;
  @ViewChild('selectSearchAuthor') selectSearchAuthor;
  @ViewChild('selectSearchPublisher') selectSearchPublisher;

  public options: Select2Options;
  public modalRef: BsModalRef;

  nested: any = {};

  authors: any = {
    data: [],
    selected: null,
    loading: false
  }

  publishers: any = {
    data: [],
    selected: null,
    loading: false
  }

  form: any = {
    data: {}
  };

  private _datatablesHelper: any = DatatablesHelper();

  constructor(
    private modalService: BsModalService,
    private _booksService: BooksService,
    private _authorsService: AuthorsService,
    private _publishersService: PublishersService
  ) {
  }

  ngOnInit() {
    this.getAuthors();
    this.getPublishers();
    this.loadSelect2();
    this.loadDatatables();
  }

  loadSelect2(){
      this.options = {
        theme: 'bootstrap',
        placeholder: 'Seleccionar',
        allowClear: true,
        width: '100%',
        language: "es"
      };
  }

  loadDatatables(): void{
    const vm = this;

    this.nested.dtOptions = {
      'initComplete': this._datatablesHelper.initComplete,
  	  'dom': this._datatablesHelper.renderDOM,
  	  'bFilter': false,
  	  'lengthMenu': [[10, 25, 50, 100, -1], [10, 25, 50, 100, 'Todos']],
  	  'serverSide': true,
  	  'processing': true,
      'responsive': true,
      'ajax': {
        'url': 'http://127.0.0.1:8000/api/books',
        'method': 'GET',
        'data': function(d) {
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
      'columns': [
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
      'drawCallback': (settings: any) => {

      },
      'rowCallback': (row: Node, data: any[] | Object, index: number) => {
        
      }
    };
  
    this.nested.dataTable = $(this.table.nativeElement);
    this.nested.dtInstance =  this.nested.dataTable.DataTable(this.nested.dtOptions);
  }

  getAuthors(){
    this.authors.loading = true;
    this._authorsService.getAuthors()
        .subscribe((response: any) => {
          const authors: Array<Select2OptionData> = response.data.map((author: any) => {
            return {
              id: author.id,
              text: author.name,
            }
          });

          this.authors.data = authors;
          this.authors.loading = false;
        });
  }

  getPublishers(){
    this.publishers.loading = true;
    this._publishersService.getPublishers()
        .subscribe((response: any) => {
          const publishers: Array<Select2OptionData> = response.data.map((publisher: any) => {
            return {
              id: publisher.id,
              text: publisher.name,
            }
          });

          this.publishers.data = publishers;
          this.publishers.loading = false;
        });
  }

  eventChangeSelect(e: any, field: string): void {
    const value = e.value;
    
    delete this.form.data[field];

    if(value){
      this.form.data[field] = {
        id: value
      };
    }
  }

  ngAfterViewInit(): void {
    const vm = this;

    vm.nested.dataTable.on('click', '.opt-edit', function(event){
      const id = $(this).data('id');
      const data = vm._datatablesHelper.getFilterData(vm.nested.dtInstance, 'id', id);

      vm.openModal(data);
    });

    vm.nested.dataTable.on('click', '.opt-remove', function(event){
      const id = $(this).data('id');

      swal({
        title: "Confirmar",
        text: "¿Desea eliminar el libro seleccionado?",
        icon: "warning",
        buttons: true,
        dangerMode: true
      })
      .then((isConfirm) => {
        if (isConfirm) {
          vm._booksService.deleteBook(id)
            .subscribe((response: any) => {
              swal(response.message, {
                icon: "success",
                title: 'Éxito'
              });

              vm.reloadData(true);
            });
        }
      });
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

  clearForm(): void{
    const select2Elements = [
      {
        element: this.selectSearchAuthor.element,
        field: 'author'
      },
      {
        element: this.selectSearchPublisher.element,
        field: 'publisher'
      }
    ];

    select2Elements.forEach( item  => {
      item.element.val(null).trigger('change');
      this.eventChangeSelect({value: null, data: []}, item.field);
    });
  }
}