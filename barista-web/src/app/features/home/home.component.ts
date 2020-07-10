import { Component, OnInit } from '@angular/core';

import { data } from './temporary_display_data';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(){ }

  // create a variable for each dataset we want stored on the page.
  // for consistency, variables end in Data, async variables end in Data$
  topComponentLicenseData = data; 
  // TODO: create DTO for each dataset, wrap it in observable

  /**
   * All initialization of the datasets & graphs occurs here. 
   * Handles subscribing of data async's into data vars. 
   */
  ngOnInit(): void {

  }

}
