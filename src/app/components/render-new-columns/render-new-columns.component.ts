import { AfterViewInit, Component, OnInit, Renderer, Renderer2, Inject } from '@angular/core';


@Component({
  selector: 'app-render-new-columns',
  templateUrl: './render-new-columns.component.html',
  styleUrls: ['./render-new-columns.component.css']
})
export class RenderNewColumnsComponent implements AfterViewInit, OnInit {
  dtOptions: DataTables.Settings = {};

  constructor(@Inject(Renderer2)  private renderer: Renderer2) { }

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

          return `<button type="button" view-person-id='${id}' class="btn btn-primary">CLICK</button>`;
        }
      }],
      drawCallback: (settings: any) => {
          const self = this;
          console.log(' Draw Callback ...');

          console.log(settings);

          // self.bindClickToViewDetails();
      }
    };
  }

  handlerClick(){
    console.log('click presionado');
  }

  ngAfterViewInit(): void {
    // this.renderer.listenGlobal('document', 'click', (event) => {
    this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute("view-person-id")) {
        console.log('person id', event.target.getAttribute("view-person-id"));
        // console.log(event.srcElement, this);
      }
    });
  }



}
