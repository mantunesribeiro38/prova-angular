import { Component, OnInit } from '@angular/core';
import { Person } from '../../models/person';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { PersonsService } from '../../services/persons.service';

@Component({
	selector: 'persons-list',
	templateUrl: './persons-list.component.html',
	styleUrls: ['./persons-list.component.scss']
})
export class PersonsListComponent implements OnInit {

	persons$: Observable<Person[]>;

	title = 'Listagem de Pessoas'

	columns = ['id','name', 'cpf', 'phone', 'email', 'cep', 'state', 'city', 'street', 'actions'];

	constructor(
		private personsService: PersonsService,
		private router: Router,
		private route: ActivatedRoute,
	) {}

	ngOnInit() {
		this.fetchData();
	}

	edit(person){

		this.router.navigate(['edit', person.id], { relativeTo: this.route });
	}

	delete(person){

		if (confirm('Deseja deletar?')){


			this.personsService.remove(person.id).subscribe(
			success => {
				console.log("successDelete", success);
				this.fetchData();
			  },
			  error => console.log("error", error)
			);
		}
	}

	fetchData() {

		this.persons$ = this.personsService.list();
	}
}