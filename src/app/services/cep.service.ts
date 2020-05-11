import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class CepService {

	constructor(public http: HttpClient) { }

	getCep(cep) {
		return this.http.get(`https://viacep.com.br/ws/${Number(cep)}/json/`)
		.pipe(
			tap(console.log)
		)
		.toPromise();
	}
}
