import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map, tap } from 'rxjs/operators';

@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
	inputSearch = new FormControl('');
	@Output() submitted = new EventEmitter<string>();

	constructor() { }

	ngOnInit(): void {
		this.onChange();
	}

	onChange():void {
		/*
		Con esto re sealizaba muchas peticiones al servidor
			this.inputSearch.valueChanges
			.pipe(
				tap(res => this.submitted.emit(res))
			)
			.subscribe();
		*/

		this.inputSearch.valueChanges
		.pipe(
			map((search: string) => search.trim()), // Quito los espacios
			debounceTime(350), // Emite el valor despues que pasa un determinado tiempo
			distinctUntilChanged(), // Verifica que el valor que va a emitir no es igual al que ha emitido
			filter((search: string) => search !== ''), // Se valida que el valor no esté vacio
			tap((search: string) => this.submitted.emit(search))
		)
		.subscribe();
	}
}
