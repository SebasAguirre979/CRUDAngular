import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstadoService } from './services/estado/estado.service';
import { PaisService } from './services/pais/pais.service';
import { PersonService } from './services/person/person.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  personForm!: FormGroup;
  pais: any;
  estado: any;
  persona: any;

  constructor(
    public fb: FormBuilder,
    public estadoService: EstadoService,
    public paisService: PaisService,
    public personService: PersonService
  ) {
  }
  ngOnInit(): void {
    this.personForm = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', Validators.required],
      pais: ['', Validators.required],
      estado: ['', Validators.required],
    }
    );;

    this.paisService.getAllPaises().subscribe(resp => {
      this.pais = resp;
      /* console.log(resp); /* para mostrar en consola lo que nos trae */

    },
      error => { console.error(error) }
    );

    this.personService.getAllPerson().subscribe(resp => {
      this.persona = resp;
    },
      error => { console.error(error) }
    );

    this.personForm.get('pais')?.valueChanges.subscribe(value => {
      this.estadoService.getAllEstadosByPais(value.id).subscribe(resp => {
        this.estado = resp;

      },
        error => { console.error(error) }
      );
    })
  }

  guardar(): void {
    this.personService.savePersona(this.personForm.value).subscribe(resp => {
      this.personForm.reset();
      
      this.persona = this.persona.filter((personas:any) => resp.id!=personas.id)
      this.persona.push(resp);
    },
      error => { console.error(error) })

  }

  eliminar(person:any){
    this.personService.deletePersona(person.id).subscribe(resp =>{
      console.log(resp)
      if(resp == false){
        this.persona.pop(person);
      }
    })
  }

  editar(person:any){
    this.personForm.setValue({
      id:person.id,
      nombre: person.nombre,
      apellido: person.apellido,
      edad: person.edad,
      pais: person.pais,
      estado: person.estado,
    })
  }

  setDataAndPagination() {
    throw new Error('Method not implemented.');
  }

}
