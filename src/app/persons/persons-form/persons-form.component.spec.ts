import { DebugElement } from '@angular/core';
import {async, ComponentFixture, fakeAsync, getTestBed, inject, TestBed, tick} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PersonsListComponent } from '../persons-list/persons-list.component';
import {PersonsService} from "../../services/persons.service";
import {ActivatedRoute, Router} from "@angular/router";
import {BrowserModule, By} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatTableModule } from '@angular/material/table'
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule} from "@angular/forms";
import {PersonsFormComponent} from "../persons-form/persons-form.component";
import {Location} from '@angular/common';
import {empty, from, Observable, of, Subject, throwError} from "rxjs";
import {CepService} from "../../services/cep.service";
import {CepMock} from "../../mocks/cep.mock";
import {PersonsMock} from "../../mocks/person.mock";
import {Person} from "../../models/person";
import {ActivatedRouteStub} from "../../testing/activated-route-stub";

//Testing Vars
let fixture: ComponentFixture<PersonsFormComponent>;
let component: PersonsFormComponent;
let rootElement: DebugElement;
let personService: PersonsService;
let cepService: CepService;
let router: Router;
let location: Location;
let cepMock:CepMock;
let personMock:PersonsMock;
let activatedRoute:ActivatedRouteStub;

describe('PersonsFormComponent tests', () => {

    beforeEach(async(() => {

        TestBed.configureTestingModule({
            declarations: [PersonsListComponent, PersonsFormComponent],
            imports: [
                BrowserModule,
                BrowserAnimationsModule,
                FormsModule,
                MatTableModule,
                MatInputModule,
                HttpClientModule,
                RouterTestingModule.withRoutes([
                    { path: '', component: PersonsListComponent },
                    { path: 'new', component:  PersonsFormComponent},
                    { path: 'edit/:id', component:  PersonsFormComponent}
                ])
            ],
            providers: [
                PersonsService,
                CepService,
                {provide: ActivatedRoute, useClass: ActivatedRouteStub}
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PersonsFormComponent);
        personService = TestBed.get(PersonsService);
        cepService = TestBed.get(CepService);
        location = TestBed.get(Location);
        router = TestBed.get(Router);

        component = fixture.componentInstance;
        rootElement = fixture.debugElement;

        cepMock = new CepMock();
        personMock = new PersonsMock();

        activatedRoute = fixture.debugElement.injector.get(ActivatedRoute) as any;

    });

    it('should call message from server if CEP not found', async() => {

        const paramRoute = "";

        activatedRoute.testParamMap = paramRoute;

        const userCreate:Person = personMock.user();

        window.alert = () => {};

        const personsSpyCreate = spyOn(personService, 'create').and.callFake(()=>{
            return of(userCreate);
        });

        const spyCepService = spyOn(cepService, 'getCep').and.callFake(() =>
            Promise.resolve({erro: true})
        );

        fixture.detectChanges();

        await fixture.whenStable().then(async () => {

            let inputCEP:HTMLInputElement  = rootElement.query(By.css('.cep')).nativeElement;
            inputCEP.value =  userCreate.cep;
            inputCEP.dispatchEvent(new Event('keyup'));

            fixture.detectChanges();
            await fixture.whenStable().then(async () => {

                let inputState:HTMLInputElement  = rootElement.query(By.css('.state')).nativeElement;

                let inputCity:HTMLInputElement  = rootElement.query(By.css('.city')).nativeElement;

                let inputStreet:HTMLInputElement  = rootElement.query(By.css('.street')).nativeElement;

                fixture.detectChanges();
                await fixture.whenStable().then(async () => {
                      expect(spyCepService).toBeCalled();
                      expect(personsSpyCreate).not.toBeCalled();
                      expect(inputState.value).toBe("");
                      expect(inputCity.value).toBe("");
                      expect(inputStreet.value).toBe("");
                });
            });

        });
    });

    it('should call message from server if fails API CEP', async() => {

        const paramRoute = "";

        activatedRoute.testParamMap = paramRoute;

        const userCreate:Person = personMock.user();

        window.alert = () => {};

        const personsSpyCreate = spyOn(personService, 'create').and.callFake(()=>{
            return of(userCreate);
        });

        const spyCepService = spyOn(cepService, 'getCep').and.callFake(() =>
            Promise.reject({error: true})
        );

        fixture.detectChanges();

        await fixture.whenStable().then(async () => {

            let inputCEP:HTMLInputElement  = rootElement.query(By.css('.cep')).nativeElement;
            inputCEP.value =  userCreate.cep;
            inputCEP.dispatchEvent(new Event('keyup'));

            fixture.detectChanges();
            await fixture.whenStable().then(async () => {

                let inputState:HTMLInputElement  = rootElement.query(By.css('.state')).nativeElement;

                let inputCity:HTMLInputElement  = rootElement.query(By.css('.city')).nativeElement;

                let inputStreet:HTMLInputElement  = rootElement.query(By.css('.street')).nativeElement;

                fixture.detectChanges();
                await fixture.whenStable().then(async () => {
                    expect(spyCepService).toBeCalled();
                    expect(personsSpyCreate).not.toBeCalled();
                    expect(inputState.value).toBe("");
                    expect(inputCity.value).toBe("");
                    expect(inputStreet.value).toBe("");
                });
            });

        });
    });

    it('should create PersonFormComponent', async() => {

        const paramRoute = "";

        activatedRoute.testParamMap = paramRoute;

        const userCreate:Person = personMock.user();

        const spyLocationBack = spyOn(location, 'back').and.returnValue('/');

        const spyLocationPath = spyOn(location, 'path').and.returnValue('new');

        const personsSpyCreate = spyOn(personService, 'create').and.callFake(()=>{
            return of(userCreate);
        });


        const spyCepService = spyOn(cepService, 'getCep').and.callFake(() =>
            Promise.resolve(cepMock.getCep())
        );

        fixture.detectChanges();

        await fixture.whenStable().then(async () => {

            let inputName:HTMLInputElement  = rootElement.query(By.css('.name')).nativeElement;
            inputName.value = userCreate.name;
            inputName.dispatchEvent(new Event('input'));
            inputName.dispatchEvent(new Event('focus'));

            let inputCPF:HTMLInputElement  = rootElement.query(By.css('.cpf')).nativeElement;
            inputCPF.value = userCreate.cpf;
            inputCPF.dispatchEvent(new Event('input'));
            inputCPF.dispatchEvent(new Event('focus'));

            let inputPhone:HTMLInputElement  = rootElement.query(By.css('.phone')).nativeElement;
            inputPhone.value = userCreate.phone;
            inputPhone.dispatchEvent(new Event('input'));
            inputPhone.dispatchEvent(new Event('focus'));

            let inputEmail:HTMLInputElement  = rootElement.query(By.css('.email')).nativeElement;
            inputEmail.value = userCreate.email;
            inputEmail.dispatchEvent(new Event('input'));
            inputEmail.dispatchEvent(new Event('focus'));


            let inputCEP:HTMLInputElement  = rootElement.query(By.css('.cep')).nativeElement;
            inputCEP.value = userCreate.cep;
            inputCEP.dispatchEvent(new Event('keyup'));

            fixture.detectChanges();

            await fixture.whenStable().then(async () => {

                let inputState:HTMLInputElement  = rootElement.query(By.css('.state')).nativeElement;
                inputState.dispatchEvent(new Event('focus'));

                let inputCity:HTMLInputElement  = rootElement.query(By.css('.city')).nativeElement;
                inputCity.dispatchEvent(new Event('focus'));

                let inputStreet:HTMLInputElement  = rootElement.query(By.css('.street')).nativeElement;
                inputStreet.dispatchEvent(new Event('focus'));


                fixture.detectChanges();
                await fixture.whenStable().then(async () => {

                    let debugElementButton =  rootElement.query(
                        By.css('.save-button')
                    );

                    let buttonNew:HTMLButtonElement  = debugElementButton.nativeElement;

                    inputCEP.dispatchEvent(new Event('focus'));

                    fixture.detectChanges();

                    buttonNew.click();

                    await fixture.whenStable().then(async () => {
                        expect(personsSpyCreate).toBeCalled();
                        expect(spyCepService).toBeCalled();
                        expect(inputName.value).toBe('João Carlos');
                        expect(inputCPF.value).toBe('31213393035');
                        expect(inputPhone.value).toBe('1532841040');
                        expect(inputEmail.value).toBe('joao.c@gmail.com');
                        expect(inputCEP.value).toBe('79096766');
                        expect(inputState.value).toBe('MS');
                        expect(inputCity.value).toBe('Campo Grande');
                        expect(inputStreet.value).toBe('Rua Rodolfho José Rospide da Motta');
                        expect(location.path()).toEqual('new');
                        expect(location.back()).toEqual('/');
                        expect(spyLocationBack).toBeCalled();
                        expect(spyLocationPath).toBeCalled();
                    });
                });
            });

        });
    });

    it('should update PersonFormComponent', async() => {
        const paramRoute = {id: '1'};

        activatedRoute.testParamMap = paramRoute;

        const userCreate:Person = personMock.user();

        const spyLocationBack = spyOn(location, 'back').and.returnValue('/');

        const spyLocationPath = spyOn(location, 'path').and.returnValue('/edit/'+paramRoute.id);

        const personsSpyUpdate = spyOn(personService, 'update').and.callFake(()=>{
            return of(userCreate);
        });

        const personsSpyFindById = spyOn(personService, 'findById').and.callFake(()=>{
            return of(userCreate);
        });

        const spyCepService = spyOn(cepService, 'getCep').and.callFake(() =>
            Promise.resolve(cepMock.getCep())
        );

        fixture.detectChanges();

        await fixture.whenStable().then(async () => {

            let inputName:HTMLInputElement  = rootElement.query(By.css('.name')).nativeElement;
            inputName.value = userCreate.name;
            inputName.dispatchEvent(new Event('input'));
            inputName.dispatchEvent(new Event('focus'));

            let inputCPF:HTMLInputElement  = rootElement.query(By.css('.cpf')).nativeElement;
            inputCPF.value = userCreate.cpf;
            inputCPF.dispatchEvent(new Event('input'));
            inputCPF.dispatchEvent(new Event('focus'));

            let inputPhone:HTMLInputElement  = rootElement.query(By.css('.phone')).nativeElement;
            inputPhone.value = userCreate.phone;
            inputPhone.dispatchEvent(new Event('input'));
            inputPhone.dispatchEvent(new Event('focus'));

            let inputEmail:HTMLInputElement  = rootElement.query(By.css('.email')).nativeElement;
            inputEmail.value = userCreate.email;
            inputEmail.dispatchEvent(new Event('input'));
            inputEmail.dispatchEvent(new Event('focus'));


            let inputCEP:HTMLInputElement  = rootElement.query(By.css('.cep')).nativeElement;
            inputCEP.value = userCreate.cep;
            inputCEP.dispatchEvent(new Event('keyup'));

            fixture.detectChanges();

            await fixture.whenStable().then(async () => {

                let inputState:HTMLInputElement  = rootElement.query(By.css('.state')).nativeElement;
                inputState.dispatchEvent(new Event('focus'));

                let inputCity:HTMLInputElement  = rootElement.query(By.css('.city')).nativeElement;
                inputCity.dispatchEvent(new Event('focus'));

                let inputStreet:HTMLInputElement  = rootElement.query(By.css('.street')).nativeElement;
                inputStreet.dispatchEvent(new Event('focus'));


                fixture.detectChanges();
                await fixture.whenStable().then(async () => {

                    let debugElementButton =  rootElement.query(
                        By.css('.save-button')
                    );

                    let buttonNew:HTMLButtonElement  = debugElementButton.nativeElement;

                    inputCEP.dispatchEvent(new Event('focus'));

                    fixture.detectChanges();

                    buttonNew.click();

                    await fixture.whenStable().then(async () => {
                        expect(personsSpyUpdate).toBeCalled();
                        expect(spyCepService).toBeCalled();
                        expect(inputName.value).toBe('João Carlos');
                        expect(inputCPF.value).toBe('31213393035');
                        expect(inputPhone.value).toBe('1532841040');
                        expect(inputEmail.value).toBe('joao.c@gmail.com');
                        expect(inputCEP.value).toBe('79096766');
                        expect(inputState.value).toBe('MS');
                        expect(inputCity.value).toBe('Campo Grande');
                        expect(inputStreet.value).toBe('Rua Rodolfho José Rospide da Motta');
                        expect(location.path()).toEqual('/edit/1');
                        expect(location.back()).toEqual('/');
                        expect(spyLocationBack).toBeCalled();
                        expect(spyLocationPath).toBeCalled();
                        expect(personsSpyFindById).toBeCalled();
                    });
                });
            });

        });
    });

    it('should back home if click cancel button', async() => {

        const paramRoute = "";

        activatedRoute.testParamMap = paramRoute;

        const userCreate:Person = personMock.user();

        const spyLocationPath = spyOn(location, 'path').and.returnValue('new');

        const spyLocationBack = spyOn(location, 'back').and.returnValue('/');

        const personsSpyCreate = spyOn(personService, 'create').and.callFake(()=>{
            return of(userCreate);
        });

        fixture.detectChanges();
        await fixture.whenStable().then(async () => {

            let debugElementButton =  rootElement.query(
                By.css('.save-button')
            );

            let buttonNew:HTMLButtonElement  = debugElementButton.nativeElement;

            let debugElementButtonCancel =  rootElement.query(
                By.css('.cancel-button')
            );

            let buttonCancel:HTMLButtonElement  = debugElementButtonCancel.nativeElement;
            fixture.detectChanges();
            buttonCancel.click();
            expect(buttonCancel.disabled).toBe(false);
            expect(personsSpyCreate).not.toBeCalled();
            expect(buttonNew.disabled).toBe(true);
            expect(spyLocationBack).toBeCalled();
            expect(location.path()).toBe('new');
            expect(spyLocationPath).toBeCalled();
            expect(location.back()).toBe('/');
        });
    });
});
