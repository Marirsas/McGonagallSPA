import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements AfterViewInit {
  images = ['assets/imagem1.jpg', 'assets/imagem3.jpg', 'assets/imagem2.jpg'];
  currentIndex = 0;
  currentImage = this.images[this.currentIndex];

  @ViewChild('carouselImage') carouselImage!: ElementRef<HTMLImageElement>;

  ngAfterViewInit() {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length; // Alterna entre as imagens
      this.carouselImage.nativeElement.classList.add('opacity-0'); // Adiciona fade-out

      setTimeout(() => {
        this.currentImage = this.images[this.currentIndex]; // Atualiza a imagem
        this.carouselImage.nativeElement.classList.remove('opacity-0'); // Adiciona fade-in
      }, 2000); // Tempo da animação
    }, 4000); // Troca a cada 4 segundos
  }
}
