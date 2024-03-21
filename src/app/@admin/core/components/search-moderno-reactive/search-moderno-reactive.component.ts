import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  filter,
} from 'rxjs/operators';

@Component({
  selector: 'app-search-moderno-reactive',
  templateUrl: './search-moderno-reactive.component.html',
  styleUrls: ['./search-moderno-reactive.component.scss'],
})
export class SearchModernoReactiveComponent
  implements OnInit, AfterViewInit, OnChanges
{
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @Input('inputPlaceholder') inputPlaceholder!: string;

  @Input('search') inputSearch!: string;

  search: FormControl = new FormControl('');

  @Output('search') searchEmitter = new EventEmitter<string>();

  constructor(private host: ElementRef<HTMLElement>) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.inputSearch === '') {
      this.search.setValue(this.inputSearch);
    }
  }

  ngOnInit(): void {
    this.search.valueChanges
      .pipe(
        map((search) => search?.trim()),
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe((term) => {
        this.searchEmitter.emit(term);
      });
  }

  ngAfterViewInit(): void {
    // setTimeout(() => this.searchInput.nativeElement.focus(), 20);
  }

  onClearSearch() {
    this.search.setValue('');
  }
}
