import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RepositoryService } from '../repository.service';
import { ActivatedRoute } from '@angular/router';
import { Repositorio } from '../repository.model';
import { timeout } from 'rxjs/operators';

@Component({
  selector: 'app-repository-detail',
  templateUrl: './repository-detail.component.html',
  styleUrl: './repository-detail.component.css',
  standalone: false,
})

export class RepositoryDetailComponent implements OnInit {
  repository?: Repositorio;
  errorMessage = '';
  isLoading = true;
  readonly activityBars = [25, 50, 30, 70, 45, 90, 50, 30, 40, 35, 65, 20];

  constructor(
    private route: ActivatedRoute,
    private repositoryService: RepositoryService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.isLoading = true;

      if (!id) {
        this.repository = undefined;
        this.errorMessage = 'No se recibio el id del repositorio.';
        this.isLoading = false;
        return;
      }

      this.repositoryService.getRepositoryById(id).pipe(timeout(10000)).subscribe({
        next: (repo) => {
          this.repository = repo;
          this.errorMessage = '';
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err: unknown) => {
          this.repository = undefined;
          if (err instanceof Error) {
            this.errorMessage = err.message || 'No fue posible cargar el repositorio.';
          } else {
            this.errorMessage = 'No fue posible cargar el repositorio.';
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    });
  }

  get starsLabel(): string {
    if (!this.repository) return '0';
    return this.repository.stars >= 1000
      ? `${(this.repository.stars / 1000).toFixed(1).replace('.0', '')}k`
      : String(this.repository.stars);
  }

  get repositoryUrl(): string {
    if (!this.repository) return '#';
    return `https://github.com/demo/${this.repository.name}`;
  }

  get topicTags(): string[] {
    if (!this.repository) return [];
    return [this.repository.language.toLowerCase(), 'github', 'explorer'];
  }

  formatTag(tag: string): string {
    const special: Record<string, string> = {
      github: 'GitHub',
      typescript: 'TypeScript',
    };
    if (special[tag.toLowerCase()]) return special[tag.toLowerCase()];
    return tag.charAt(0).toUpperCase() + tag.slice(1);
  }

  get issuesCount(): number {
    if (!this.repository) return 0;
    return (this.repository.id * 3) % 28 + 1;
  }

  get pullRequestsCount(): number {
    if (!this.repository) return 0;
    return (this.repository.id * 2) % 9 + 1;
  }

  get languageBreakdown(): Array<{ name: string; value: number; color: string }> {
    if (!this.repository) return [];

    return [
      { name: this.repository.language, value: 60, color: '#f1e05a' },
      { name: 'HTML', value: 30, color: '#e34c26' },
      { name: 'CSS', value: 10, color: '#563d7c' },
    ];
  }

  formatDate(dateStr: string): string {
    const date = new Date(`${dateStr}T12:00:00`);
    return date.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}