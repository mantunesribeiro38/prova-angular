import { DebugElement } from '@angular/core';
import {async, ComponentFixture, fakeAsync, getTestBed, TestBed, tick} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PersonsListComponent } from './persons-list.component';
import {PersonsService} from "../../services/persons.service";
import { Router} from "@angular/router";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatTableModule } from '@angular/material/table'
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule} from "@angular/forms";
import {empty, from, Observable, of, throwError} from 'rxjs';
import {PersonsMock} from "../../mocks/person.mock";
import { By } from '@angular/platform-browser';
import {PersonsFormComponent} from "../persons-form/persons-form.component";
import {Location} from '@angular/common';
//Testing Vars
let fixture: ComponentFixture<PersonsListComponent>;
let component: PersonsListComponent;
let rootElement: DebugElement;
let personService: PersonsService;
let router: Router;
let personMock = new PersonsMock();
let location: Location;

describe('PersonsListComponent tests', () => {

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
          { path: 'new', component:  PersonsFormComponent},
          { path: 'edit/:id', component:  PersonsFormComponent}
        ])
      ],
      providers: [
        PersonsService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonsListComponent);
    personService = TestBed.get(PersonsService);
    location = TestBed.get(Location);
    router = TestBed.get(Router);

    component = fixture.componentInstance;
    rootElement = fixture.debugElement;

    fixture.ngZone.run(() => {
      router.initialNavigation();
    });
  });


  it("should create PersonsListComponent component", () => {
    expect(component).toBeTruthy();
  });

  it('should load persons from the server', async () => {

    const personsSpy = jest.spyOn(personService, 'list');

    personsSpy.mockImplementation(() => of(personMock.list()));


    fixture.detectChanges();

      await fixture.whenStable().then(async () => {

          let dataList = null;

          component.persons$.subscribe(
              data => dataList = data
          );

          fixture.detectChanges();

          await fixture.whenStable().then(() => {

              let tableRows = fixture.nativeElement.querySelectorAll('tr');

              // Header row
              let headerRow = tableRows[0];

              expect(tableRows.length).toBe(2);
              expect(headerRow.cells[0].innerHTML.trim()).toBe('Id');
              expect(headerRow.cells[1].innerHTML.trim()).toBe('Nome');
              expect(headerRow.cells[2].innerHTML.trim()).toBe('CPF');
              expect(headerRow.cells[3].innerHTML.trim()).toBe('Telefone');
              expect(headerRow.cells[4].innerHTML.trim()).toBe('E-mail');
              expect(headerRow.cells[5].innerHTML.trim()).toBe('CEP');
              expect(headerRow.cells[6].innerHTML.trim()).toBe('Estado');
              expect(headerRow.cells[7].innerHTML.trim()).toBe('Cidade');
              expect(headerRow.cells[8].innerHTML.trim()).toBe('Rua');
              expect(headerRow.cells[9].innerHTML.trim()).toBe('Ações');

              // Data rows
              let rowOne = tableRows[1];

              expect(rowOne.cells[0].innerHTML.trim()).toBe('1');
              expect(rowOne.cells[1].innerHTML.trim()).toBe('João Carlos');
              expect(rowOne.cells[2].innerHTML.trim()).toBe('31213393035');
              expect(rowOne.cells[3].innerHTML.trim()).toBe('1532841040');
              expect(rowOne.cells[4].innerHTML.trim()).toBe('joao.c@gmail.com');
              expect(rowOne.cells[5].innerHTML.trim()).toBe('79096766');
              expect(rowOne.cells[6].innerHTML.trim()).toBe('MS');
              expect(rowOne.cells[7].innerHTML.trim()).toBe('Campo Grande');
              expect(rowOne.cells[8].innerHTML.trim()).toBe('Rua Rodolfho José Rospide da Motta');

              //Actions
              let cellElementActions:HTMLTableCellElement = rowOne.cells[9];
              let editAction = cellElementActions.children[0].innerHTML;
              let deleteAction = cellElementActions.children[1].innerHTML;
              expect(editAction).toBe('Editar');
              expect(deleteAction).toBe('Remover');

              let debugElementSpan =  rootElement.query(
                  By.css('.loading-data')
              );

              expect(personsSpy).toHaveBeenCalled();
              expect(dataList).toMatchObject(personMock.list());

              expect(debugElementSpan).toBeNull();
          });
      });
  });

  it('should navigate to route PersonsFormComponent new', async () => {

        const personsSpy = jest.spyOn(personService, 'list');

        personsSpy.mockImplementation(() => of(personMock.list()));

        fixture.detectChanges();

        await fixture.whenStable().then(async () => {

            let dataList = null;

            component.persons$.subscribe(
                data => dataList = data
            );

            fixture.detectChanges();

            await fixture.whenStable().then(async () => {
                let debugElementButton =  rootElement.query(
                    By.css('.add-person')
                );

                let buttonNew:HTMLButtonElement  = debugElementButton.nativeElement;
                buttonNew.click();

                fixture.detectChanges();

                await fixture.whenStable().then(async () => {
                    expect(location.path()).toEqual('/new');
                });
            });
        });
    });

    it('should navigate to route PersonsFormComponent edit', async () => {

        const personsSpy = jest.spyOn(personService, 'list');

        personsSpy.mockImplementation(() => of(personMock.list()));

        fixture.detectChanges();

        await fixture.whenStable().then(async () => {

            let dataList = null;

            component.persons$.subscribe(
                data => dataList = data
            );

            fixture.detectChanges();

            await fixture.whenStable().then(async () => {

                let tableRows = fixture.nativeElement.querySelectorAll('tr');

                // Data rows
                let rowOne = tableRows[1];

                let cellElementActions:HTMLTableCellElement = rowOne.cells[9];

                let editAction:Element = cellElementActions.children[0];

                editAction.dispatchEvent(new MouseEvent('click'));

                fixture.detectChanges();

                await fixture.whenStable().then(() => {
                    expect(location.path()).toEqual('/edit/1');
                });
            });
        });
    });

    it('should call the server to delete a person item if the user confirms', async () => {

        const personsSpy = jest.spyOn(personService, 'list');

        const personsSpyDelete = jest.spyOn(personService, 'remove');

        const mockWindows = jest.spyOn(window, 'confirm');

        mockWindows.mockReturnValue(true);

        personsSpy.mockImplementation(() => of(personMock.list()));

        personsSpyDelete.mockImplementation(() => {
            return of({});
        });

        fixture.detectChanges();

        await fixture.whenStable().then(async () => {

            let dataList = null;

            component.persons$.subscribe(
                data => dataList = data
            );

            fixture.detectChanges();

            await fixture.whenStable().then(async () => {

                let tableRows = fixture.nativeElement.querySelectorAll('tr');

                // Data rows
                let rowOne = tableRows[1];

                let cellElementActions:HTMLTableCellElement = rowOne.cells[9];

                let deleteAction:Element = cellElementActions.children[1];

                deleteAction.dispatchEvent(new MouseEvent('click'));

                fixture.detectChanges();

                await fixture.whenStable().then(() => {
                    expect(personsSpyDelete).toHaveBeenCalledWith(1);
                });
            });
        });
    });

    it('should NOT call the server to delete a person item if the user cancels', async () => {

        const personsSpy = jest.spyOn(personService, 'list');

        const personsSpyDelete = jest.spyOn(personService, 'remove');

        const mockWindows = jest.spyOn(window, 'confirm');

        mockWindows.mockReturnValue(false);

        personsSpy.mockImplementation(() => of(personMock.list()));

        personsSpyDelete.mockImplementation(() => {
            return empty();
        });

        fixture.detectChanges();

        await fixture.whenStable().then(async () => {

            let dataList = null;

            component.persons$.subscribe(
                data => dataList = data
            );

            fixture.detectChanges();

            await fixture.whenStable().then(async () => {

                let tableRows = fixture.nativeElement.querySelectorAll('tr');

                // Data rows
                let rowOne = tableRows[1];

                let cellElementActions:HTMLTableCellElement = rowOne.cells[9];

                let deleteAction:Element = cellElementActions.children[1];

                deleteAction.dispatchEvent(new MouseEvent('click'));

                fixture.detectChanges();

                await fixture.whenStable().then(() => {
                    expect(personsSpyDelete).not.toHaveBeenCalled();
                });
            });
        });
    });

    it('should return message error from server when Http failure response', async () => {

        const personsSpy = jest.spyOn(personService, 'list');

        let errorMessage = 'Http failure response for http://localhost:3000/persons: 0 Unknown Error';

        let response = null;

        personsSpy.mockImplementation(() => {
            return throwError(errorMessage);
        });

        fixture.detectChanges();

        await fixture.whenStable().then(() => {
            component.persons$.subscribe(

                data => console.log(data),
                error=> response = error
            );

            let debugElementSpan =  rootElement.query(
                By.css('.loading-data')
            );

            let loadSpan:HTMLSpanElement  = debugElementSpan.nativeElement.innerHTML;

            expect(response).toBe(errorMessage);
            expect(loadSpan).toBe("Carregando Categorias...");
        });
    });
});
