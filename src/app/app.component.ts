import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  githubActionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.githubActionForm = this.fb.group({
      jobName: ['', Validators.required],
      runsOn: ['ubuntu-latest', Validators.required]
    });
  }

  generateYAML() {
    const formValue = this.githubActionForm.value;

    const yamlContent = `
      name: Generated Workflow
      on: push
      jobs:
        ${formValue.jobName}:
          runs-on: ${formValue.runsOn}
          steps:
          - name: Checkout code
            uses: actions/checkout@v2
    `;

    console.log(yamlContent);
    // You can then display this YAML in a text area or download it as a file
  }

}
