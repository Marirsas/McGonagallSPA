import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BookService } from '../../Services/book.service';
import { PageLoaderService } from '../../Services/page-loader.service';
import Swal from 'sweetalert2';
import { Book } from '../../Models/book';
import { NgIf } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Category } from '../../Models/category';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgxDatatableModule, NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  bookCollectionAv: any[] = [];
  bookCollectionUnAv: any[] = [];
  bookColletionView: any[] = [];
  activeAv: boolean = true;
  activeUnAv: boolean = false;
  modalAberto: boolean = false;
  bookForm!: FormGroup;
  categoryForm!: FormGroup;
  livroSelecionado: any;
  allCategories: Category[] | undefined;
  isEditingOrCreating: string = '';
  modalAberto2: boolean = false;

  constructor(
    private bookServ: BookService,
    private loaderServ: PageLoaderService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.bookForm = this.fb.group({
      isbn: ['', [Validators.required]],
      title: ['', [Validators.required]],
      author: ['', [Validators.required]],
      category: ['', [Validators.required]],
      cover: ['', [Validators.required]],
      price: ['', [Validators.required]],
    });

    this.categoryForm = this.fb.group({
      name: ['', [Validators.required]],
    });

    this.getAllCategories();
    this.asyncAllAv('available');
  }

  async asyncAllAv(check?: string) {
    await this.getAllAvBooks();
    await this.getAllUnavBooks();
    if (check != 'available') {
      this.bookColletionView = this.bookCollectionUnAv;
    } else {
      this.bookColletionView = this.bookCollectionAv;
    }
  }

  //No login is required
  getAllAvBooks(): Promise<any> {
    return new Promise((resolve) => {
      this.bookServ.get('book/available').subscribe(
        (resp) => {
          this.bookCollectionAv = resp;
          resolve(true);
        },
        (error) => {
          console.error(error);
        }
      );
    });
  }

  //Manager logged In
  getAllUnavBooks(): Promise<any> {
    return new Promise((resolve) => {
      this.bookServ.get('book/unavailable').subscribe(
        (resp) => {
          this.bookCollectionUnAv = resp;
          resolve(true);
        },
        (error) => {
          console.error(error);
        }
      );
    });
  }

  alterBookCollection(available: string) {
    if (available == 'available') {
      this.bookColletionView = this.bookCollectionAv;
      this.activeAv = true;
      this.activeUnAv = false;
    } else if (available == 'unavailable') {
      this.bookColletionView = this.bookCollectionUnAv;
      this.activeUnAv = true;
      this.activeAv = false;
    }
  }

  createBook() {
    let arrayAuthors = this.bookForm.value.author.split(',');
    const bookJson = {
      isbn: this.bookForm.value.isbn,
      title: this.bookForm.value.title,
      author: arrayAuthors,
      category: this.bookForm.value.category,
      cover: this.bookForm.value.cover,
      price: this.bookForm.value.price,
    };

    this.bookServ.add('book', bookJson).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Book added successfully!.',
        });

        this.fecharModal();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error adding this book!',
        });
      },
    });
  }

  updateBook() {
    console.log(typeof this.bookForm.value.author);
    console.log(this.bookForm.value.author);
    let arrayAuthors =
      typeof this.bookForm.value.author == 'object'
        ? this.bookForm.value.author
        : this.bookForm.value.author.split(',');
    const bookJson = {
      isbn: this.bookForm.value.isbn,
      title: this.bookForm.value.title,
      author: arrayAuthors,
      cover: this.bookForm.value.cover,
      price: this.bookForm.value.price,
    };

    this.bookServ.updateBook(this.bookForm.value.isbn, bookJson).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Book updated successfully!.',
        });

        this.fecharModal();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error updating this book!',
        });
      },
    });
  }

  updateBookAvailability(book: any) {
    book.available = !book.available;
    this.bookServ.updateBookAvailability(book, book.isbn).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Availability updated successfully!',
        });
        this.attView();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error updating this book availability!',
        });
      },
    });
  }

  attView() {
    let check = this.activeAv ? 'available' : 'unavailable';
    this.asyncAllAv(check);
    this.alterBookCollection(check);
  }

  fillBookForm(livro: Book) {
    this.bookForm.get('isbn')?.setValue(livro.isbn);
    this.bookForm.get('title')?.setValue(livro.title);
    this.bookForm.get('author')?.setValue(livro.author);
    this.bookForm.get('category')?.setValue(livro.category);
    this.bookForm.get('cover')?.setValue(livro.cover);
    this.bookForm.get('price')?.setValue(livro.price);
  }

  createOrUpdate(isEditingOrCreating: string) {
    if (isEditingOrCreating === 'creating') {
      this.createBook();
    } else if (isEditingOrCreating === 'editing') {
      this.updateBook();
    }
  }

  deleteBook(isbn: string) {
    Swal.fire({
      icon: 'warning',
      titleText: 'Are you sure deleting this book? ISBN: ' + isbn,
      showCancelButton: true,
      showConfirmButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.bookServ.deleteBook(isbn).subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Book deleted successfully!',
            });
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error deleting this book!',
            });
          },
        });
      }
    });
  }

  abrirModal(isEditingOrCreating: string, livro?: Book) {
    this.isEditingOrCreating = isEditingOrCreating;
    this.livroSelecionado = livro;
    this.modalAberto = true;
    this.fillBookForm(this.livroSelecionado);
  }

  fecharModal() {
    this.modalAberto = false;
    this.livroSelecionado = null;
    this.bookForm.get('isbn')?.setValue('');
    this.bookForm.get('title')?.setValue('');
    this.bookForm.get('author')?.setValue('');
    this.bookForm.get('category')?.setValue('');
    this.bookForm.get('cover')?.setValue('');
    this.bookForm.get('price')?.setValue('');
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

  abrirModalCategory() {
    this.modalAberto2 = true;
  }

  fecharModalCategory() {
    this.modalAberto2 = false;
    this.categoryForm.get('name')?.setValue('');
  }

  fecharModalCategoryFora(event: Event) {
    if (event.target === event.currentTarget) {
      this.fecharModalCategory();
    }
  }

  addNewCategory() {
    const categoryJson = {
      name: this.categoryForm.value.name,
    };
    this.bookServ.add('bookcategory', categoryJson).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Category added successfully!.',
        });
        this.fecharModalCategory();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error adding this category!',
        });
      },
    });
  }
}
