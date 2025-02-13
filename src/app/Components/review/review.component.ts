import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User1 } from '../../Models/user1';
import { UsersService } from '../../Services/users.service';
import { Router } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from '../../Services/auth.service';
import { BookService } from '../../Services/book.service';
import { SortByAvailabilityPipe } from '../../Pipes/sort-by-availability.pipe';
import { Book } from '../../Models/book';
import { Category } from '../../Models/category';
import { map } from 'rxjs';
import { UnavailableBooksDirective } from '../../Directives/unavailable-books.directive';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    SortByAvailabilityPipe,
    UnavailableBooksDirective,
    CommonModule,
  ],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css',
})
export class ReviewComponent implements OnInit {
  reviewForm!: FormGroup;
  modalAberto: boolean = false;
  livroSelecionado: Book | null = null;
  allCategories: Category[] | undefined;
  selectedCategory: string = 'all';
  bookCollection: any[] = [];
  isLogged: any;
  reviewCollection: any[] = [];
  teste: boolean = false;

  constructor(
    private fb: FormBuilder,
    private loginServ: AuthService,
    private myRouter: Router,
    private bookServ: BookService
  ) {
    this.reviewForm = this.fb.group({
      isbn: ['', [Validators.required]],
      review: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loginServ.user.pipe(map((user) => user)).subscribe((user) => {
      this.isLogged = user;
    });

    this.getAllCategories();
    this.getAllBooks();
  }

  abrirModal(livro: Book) {
    this.livroSelecionado = livro;
    this.modalAberto = true;
    this.getAllReviews(this.livroSelecionado.isbn);
    this.reviewForm.get('isbn')?.setValue(this.livroSelecionado.isbn);
  }

  fecharModal() {
    this.modalAberto = false;
    this.livroSelecionado = null;
    this.reviewForm.get('isbn')?.setValue('');
    this.reviewForm.get('review')?.setValue('');
    if (this.teste == true) {
      this.teste = false;
    }
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

  filterByCategory(category: any) {
    const selectElement = category as HTMLSelectElement;
    this.selectedCategory = selectElement.value;
  }

  onSubmit() {
    if (this.reviewForm.valid) {
      console.log('User data:', this.reviewForm.value);
      // Chamar o método para adicionar o review
      this.registerNewReview();
    }
  }

  registerNewReview() {
    if (this.reviewForm.valid) {
      this.bookServ.add('review', this.reviewForm.value).subscribe(() => {
        this.fecharModal();
        Swal.fire({
          icon: 'success',
          title: 'New review created successfully!',
        });
      });
      this.myRouter.navigate(['reviews']);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error creating new review! Please try again.',
      });
    }
  }

  getAllReviews(isbn: string) {
    this.bookServ.get('review/' + isbn).subscribe((resp: any) => {
      this.reviewCollection = resp;
      console.log(this.reviewCollection);
    });
  }

  toCreteReviewPage() {
    this.teste = !this.teste;
    this.reviewForm.get('review')?.setValue('');
  }
}
