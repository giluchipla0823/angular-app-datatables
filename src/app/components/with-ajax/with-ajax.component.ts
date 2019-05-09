import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-with-ajax',
  templateUrl: './with-ajax.component.html',
  styleUrls: ['./with-ajax.component.css']
})
export class WithAjaxComponent implements OnInit {
  dtOptions: DataTables.Settings = {};

  constructor() { }

  ngOnInit(): void {
    this.dtOptions = {
      /* serverSide: true,
      processing: true, */
      pagingType: 'full_numbers',
      responsive: true,
      ajax: {
        url: 'assets/data/persons.json',
        beforeSend: () => {

        },
        complete: (response) => {
          let data = response.responseJSON;

          console.log(data);
        }
      },
      columns: [
        {
          title: 'ID',
          data: 'id'
        }, {
          title: 'First name',
          data: 'firstName'
        }, {
          title: 'Last name',
          data: 'lastName'
        },
        {
          title: 'Age',
          data: 'age'
        }
      ]
    };
  }

}
