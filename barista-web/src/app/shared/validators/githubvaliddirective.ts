import { Directive } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ProjectApiService } from '@app/shared/api';

@Directive({
  selector: '[appgithubValidator]',
})
export class githubValidDirective {
  constructor(private gitHubUrlModel: NgModel, private projectApiService: ProjectApiService) {
    this.gitHubUrlModel.control.valueChanges.subscribe((value: string) => {
      if (value === undefined || value.length === 0) {
        return;
      }
      this.projectApiService.githubUrlValid(value).subscribe(
        (response) => {
          if (response === 'error') {
            this.gitHubUrlModel.control.setErrors({ gitHubUrlDoesNotExist: true });
          } else {
            return null;
          }
        },
        (error) => {},
      );
    });
  }
}
