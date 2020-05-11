import { Component, OnInit } from '@angular/core';
import { CepService } from '../../services/cep.service';
import { PersonsService } from '../../services/persons.service';
import { Person } from '../../models/person';
import * as Constants from '../../constants/constants';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';


@Component({
	selector: 'persons-form',
	templateUrl: './persons-form.component.html',
	styleUrls: ['./persons-form.component.scss']
})
export class PersonsFormComponent implements OnInit {

	person:Person;

	actionCreate = false ;

	actionUpdate = false;

	constructor(
		private cepService:CepService,
		private personService:PersonsService,
		private location: Location,
		private activatedRoute: ActivatedRoute
	){
		this.person = new Person();
	}

	ngOnInit() {
		let id = this.activatedRoute.snapshot.paramMap.get('id');
		(id) ? this.fetchPerson(id): this.actionCreate = true ;

	}

	onSubmit(form){

		(this.actionCreate) ? this.create(): this.update(); 		
	}

	create() {
		console.log("create");
		this.personService.create(this.person).subscribe(
			success => {
				console.log("success create", success);
				this.location.back();
			  },
			  error => console.log("error", error)
		);
	}

	update() {

		this.personService.update(this.person).subscribe(
			success => {
				console.log("success update", success)
				this.location.back();
			  },
			  error => 	console.log("error", error)
		);
	}

	cancel() {
		this.location.back();
	}

	changeCep(event) {

		let cep = event.target.value


		if (cep.length == Constants.KEY_LENGTH_CEP) {
			this.cepService.getCep(cep).then((apiResponse: any) => {

				if (apiResponse.erro) {
					return alert('Cep não encontrado')
				}
				
				this.person = {
					...this.person,
					cep: apiResponse.cep.replace('-', ''),
					state: apiResponse.uf,
					city: apiResponse.localidade,
					street: apiResponse.logradouro
				}

			}).catch(error => {
				alert('Erro ao buscar o cep')
				console.log(error);
			});
		}
	}

	fetchPerson(id) {

		this.actionUpdate = true;
		
		this.personService.findById(id).subscribe(
			data => this.person = data,
			error => console.log("error", error)
		);
	}
}