import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  githubActionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.githubActionForm = this.fb.group({
      workflowName: ['', Validators.required],
      on: ['push', Validators.required],
      jobName: ['boss-deploy', Validators.required],
      runsOn: ['ubuntu-latest', Validators.required],
      environmentVariables: this.fb.array([
        this.fb.group({
          label: [''],
          value: ['']
        })
      ]),
      steps: this.fb.array([
        this.fb.group({
          stepName: ['', Validators.required],
          usesAction: [''],
          runCommand: ['']
        })
      ])
    });
  }

  get environmentVariables() {
    return (this.githubActionForm.get('environmentVariables') as FormArray);
  }

  get steps() {
    return (this.githubActionForm.get('steps') as FormArray);
  }

  addEnvironmentVariable() {
    this.environmentVariables.push(this.fb.group({
      label: [''],
      value: ['']
    }));
  }

  addStep() {
    const step = this.fb.group({
      stepName: ['', Validators.required],
      usesAction: [''],
      runCommand: ['']
    });

    if (step instanceof FormGroup) {
      this.steps.push(step);
    }
  }


  generateYAML() {
    const formValue = this.githubActionForm.value;
    let envYAML = '';
    formValue.environmentVariables.forEach((env: any) => {
      envYAML += ` ${env.label}: ${env.value}\n`;
    });

    let stepsYAML = '';
    formValue.steps.forEach((step: any) => {
      stepsYAML += `- name: ${step.stepName}\n`;
      if (step.usesAction) {
        stepsYAML += ` uses: ${step.usesAction}\n`;
      }
      if (step.runCommand) {
        stepsYAML += ` run: ${step.runCommand}\n`;
      }
    });

    const yamlContent = `
      name: ${formValue.workflowName}
      on: ${formValue.on}
      jobs:
        ${formValue.jobName}:
          runs-on: ${formValue.runsOn}
          env:
            ${envYAML}
          steps:
            ${stepsYAML}
    `;

    console.log(yamlContent);
    // You can then display this YAML in a text area or download it as a file
  }

}
