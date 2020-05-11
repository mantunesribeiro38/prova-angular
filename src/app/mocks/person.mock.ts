import {Observable} from "rxjs";

export class PersonsMock {

    list(): Array<{}> {
        return [
            {
                "id": 1,
                "name": "João Carlos",
                "cpf": "31213393035",
                "phone": "1532841040",
                "email": "joao.c@gmail.com",
                "cep": "79096766",
                "state": "MS",
                "city": "Campo Grande",
                "street": "Rua Rodolfho José Rospide da Motta"
            },
        ];
    }

    user() {
        return  {
            "id": 1,
            "name": "João Carlos",
            "cpf": "31213393035",
            "phone": "1532841040",
            "email": "joao.c@gmail.com",
            "cep": "79096766",
            "state": "MS",
            "city": "Campo Grande",
            "street": "Rua Rodolfho José Rospide da Motta"
        }
    }

}
