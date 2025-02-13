import { Component, OnInit } from '@angular/core';
import { BookService } from '../../Services/book.service';
import { PageLoaderService } from '../../Services/page-loader.service';
import { CommonModule } from '@angular/common';
import { Book } from '../../Models/book';
import { Category } from '../../Models/category';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { map } from 'rxjs';
import { UnavailableBooksDirective } from '../../Directives/unavailable-books.directive';

import { SortByAvailabilityPipe } from '../../Pipes/sort-by-availability.pipe';
import { User1 } from '../../Models/user1';

@Component({
  selector: 'app-book-listing',
  standalone: true,
  imports: [CommonModule, UnavailableBooksDirective, SortByAvailabilityPipe],
  templateUrl: './book-listing.component.html',
  styleUrl: './book-listing.component.css',
})
export class BookListingComponent implements OnInit {
  modalAberto: boolean = false;
  selectedBook: Book | null = null;
  allCategories: Category[] | undefined;
  selectedCategory: string = 'all';
  bookCollection: any[] = [];
  isLogged: any;
  isbnWanted: any;
  recommendations: boolean = false;
  user?: User1;
  name: string = '';
  existingBooks: number = 0;

  constructor(
    private bookServ: BookService,
    private loaderServ: PageLoaderService,
    private route: ActivatedRoute,
    private loginServ: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.location.reload();
      }
    });

    this.loginServ.getUser().subscribe((answer) => {
      this.user = answer;
      let arr = this.user.name.split(' ');
      this.name = arr[0];
    });

    this.loginServ.user.pipe(map((user) => user)).subscribe((user) => {
      this.isLogged = user;
    });

    let url_param = this.route.snapshot.paramMap.get('isbn') || '';
    let url_param2 = this.route.snapshot.paramMap.get('recommendations') || '';

    if (url_param2 == 'recommendations') {
      this.recommendations = true;
    } else {
      this.isbnWanted = url_param;
    }

    if (this.isbnWanted) {
      this.getBookByIsbn(this.isbnWanted);
    } else {
      this.getAllCategories();
      if (!this.isLogged) {
        this.getAllAvBooks();
      } else if (this.isLogged.role == 'client') {
        if (this.recommendations) {
          this.getAwait();
        } else {
          this.getAllBooks();
        }
      } else {
        this.getAllUnavBooks();
      }
    }
  }

  openModal(livro: Book) {
    this.selectedBook = livro;
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
    this.selectedBook = null;
  }

  fecharModalFora(event: Event) {
    if (event.target === event.currentTarget) {
      this.fecharModal();
    }
  }

  getAllCategories() {
    this.bookServ.get('bookcategory').subscribe((resp) => {
      this.allCategories = resp;
    });
  }

  //Client logged In
  getAllBooks() {
    this.bookServ.get('book').subscribe(
      (resp) => {
        this.bookCollection = resp;
        console.log(resp);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  //No login is required
  getAllAvBooks(): Promise<any> {
    return new Promise((resolve) => {
      this.bookServ.get('book/available').subscribe(
        (resp) => {
          this.bookCollection = resp;
          console.log(resp);
          resolve(true);
        },
        (error) => {
          console.error(error);
        }
      );
    });
  }

  //Manager logged In
  getAllUnavBooks() {
    this.bookServ.get('book/unavailable').subscribe(
      (resp) => {
        this.bookCollection = resp;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getBookByIsbn(isbn: string) {
    this.bookServ.get('book/' + isbn).subscribe((resp: any) => {
      if ((resp && resp.available) || this.isLogged) {
        this.bookCollection?.push(resp);
      }
      if (resp == null) {
        this.existingBooks = 0;
        this.selectedCategory = '';
      }
    });
  }

  filterByCategory(category: any) {
    const selectElement = category as HTMLSelectElement;
    this.selectedCategory = selectElement.value;
    this.existingBooks = 0;
    for (let i = 0; i < this.bookCollection.length; i++) {
      if (this.bookCollection[i].category == this.selectedCategory) {
        this.existingBooks++;
      }
    }
  }

  getRandomBooks(): Promise<any> {
    return new Promise((resolve) => {
      if (this.bookCollection.length < 3) {
        // Se houver menos de 3 livros, pega todos disponíveis
        this.bookCollection = [...this.bookCollection];
      } else {
        // Se houver 3 ou mais livros, pega aleatórios
        this.bookCollection = [...this.bookCollection]
          .sort(() => Math.random() - 0.5) // Embaralha
          .slice(0, 6); // Seleciona os 3 primeiros
      }
      console.log(this.bookCollection);
      resolve(true);
    });
  }

  async getAwait() {
    await this.getAllAvBooks();
    await this.getRandomBooks();
  }
}
