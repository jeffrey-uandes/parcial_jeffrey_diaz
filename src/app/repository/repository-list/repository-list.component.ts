import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Repositorio } from '../repository.model';
import { RepositoryService } from '../repository.service';

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  'C#': '#178600',
  Go: '#00add8',
  Rust: '#dea584',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  Ruby: '#701516',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  YAML: '#cb171e',
};

@Component({
  selector: 'app-repository-list',
  templateUrl: './repository-list.component.html',
  styleUrl: './repository-list.component.css',
  standalone: false
})
export class RepositoryListComponent implements OnInit {
  repositories: Repositorio[] = [];
  searchTerm = '';
  errorMessage = '';

  constructor(
    private repositoryService: RepositoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.repositoryService.getRepositories().subscribe({
      next: (repos) => {
        this.repositories = repos;
        this.errorMessage = '';
        this.cdr.detectChanges();
      },
      error: () => {
        this.repositories = [];
        this.errorMessage = 'No fue posible cargar los repositorios.';
        this.cdr.detectChanges();
      }
    });
  }

  get filteredRepositories(): Repositorio[] {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) return this.repositories;
    return this.repositories.filter(r =>
      r.name.toLowerCase().includes(term) ||
      r.description.toLowerCase().includes(term) ||
      r.language.toLowerCase().includes(term)
    );
  }

  getLangColor(language: string): string {
    return LANGUAGE_COLORS[language] ?? '#8e8e8e';
  }

  formatStars(count: number): string {
    if (count >= 1000) return (count / 1000).toFixed(1).replace('.0', '') + 'k';
    return String(count);
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr + 'T12:00:00');
    const day = date.getDate();
    const monthNames = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `Creado el ${day} ${month} ${year}`;
  }
}
