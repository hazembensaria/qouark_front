  import {
    Component,
    DestroyRef,
    inject,
    signal,
    effect,
    AfterViewInit
  } from '@angular/core';

  import { AppStore } from '../../../../store/app.store';
  import { defaultQuery, IQuery } from '../../../../interface/query';

  import {
    debounceTime,
    distinct,
    distinctUntilChanged,
    Subject
  } from 'rxjs';

  import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

  import { ExtractArrayValue } from '../../../../pipe/extractArrayValue';

  import {
    CommonModule,
    DatePipe,
    NgClass
  } from '@angular/common';

  import {
    formatFileSize,
    getFormDate
  } from '../../../../utils/fileutils';

  import {
    FormsModule,
    NgForm
  } from '@angular/forms';

  import { DialogService } from '../../../../service/dialog';

  import {
    ActivatedRoute,
    Router,
    RouterLink
  } from '@angular/router';

  import Sortable from 'sortablejs';

  @Component({
    selector: 'app-tickets',
    standalone: true,

    imports: [
      ExtractArrayValue,
      NgClass,
      FormsModule,
      DatePipe,
      RouterLink,
      CommonModule
    ],

    templateUrl: './tickets.html',
  })

  export class Tickets implements AfterViewInit {

    files = signal<{ name: string, size: string }[]>([]);

    filesToSave: File[] = [];

    protected store = inject(AppStore);

    private destroyed = inject(DestroyRef);

    private dialogService = inject(DialogService);

    private router = inject(Router);

    private readonly inputSubject: Subject<IQuery> = new Subject();

    currentView = signal<'kanban' | 'grid' | 'list'>('kanban');

    kanbanColumns = [
      'NEW',
      'IN PROGRESS',
      'IN REVIEW',
      'COMPLETED'
    ];

    kanbanBoard: Record<string, any[]> = {
      'NEW': [],
      'IN PROGRESS': [],
      'IN REVIEW': [],
      'COMPLETED': []
    };

    constructor(private route: ActivatedRoute) {

      effect(() => {

        const allTickets = this.store?.tickets() || [];

        this.kanbanColumns.forEach(col => {

          this.kanbanBoard[col] = [];

        });

        allTickets.forEach((ticket: any) => {

          if (this.kanbanBoard[ticket.status]) {

            this.kanbanBoard[ticket.status].push(ticket);

          }

        });

        setTimeout(() => {

          this.initializeSortable();

        });

      });

    }

    ngAfterViewInit(): void {

      this.initializeSortable();

    }

    initializeSortable(): void {

      this.kanbanColumns.forEach((col) => {

        const element = document.getElementById(col);

        if (!element) return;

        if ((element as any)._sortableInitialized) return;

        (element as any)._sortableInitialized = true;

        Sortable.create(element, {

          group: 'kanban',

          animation: 150,

          ghostClass: 'opacity-50',

          dragClass: 'rotate-1',

          onEnd: (event: any) => {

            const ticketUuid =
              event.item.getAttribute('data-ticket');

            const newStatus =
              event.to.getAttribute('data-column');

            const ticket =
              this.store?.tickets()
                ?.find((t: any) =>
                  t.ticketUuid === ticketUuid);

            if (!ticket) return;

            ticket.status = newStatus;

            // backend update
            this.store.updateTicket({
              ...ticket,
              status: newStatus
            });
            this.store.getTickets({
              projectUuid: this.projectUuid,
              query: defaultQuery
            });

          }

        });

      });

    }

    navigateToTicket(uuid: string) {

      this.router.navigate(['/tickets', uuid]);

    }
  projectUuid!: string;

    // ngOnInit() {
    //       this.route.paramMap.subscribe(params => {
    //   this.projectUuid = params.get('projectUuid')!;
    //   console.log(this.projectUuid);
    // });
    //   if (!this.store?.tickets()) {
    //     console.log("Fetching tickets with projectUuid:", this.projectUuid, "and defaultQuery:", defaultQuery);
    //     this.store.getTickets({ projectUuid: this.projectUuid, query: defaultQuery });

    //   }

    //   this.inputSubject
    //     .pipe(
    //       debounceTime(500),
    //       distinct(),
    //       takeUntilDestroyed(this.destroyed)
    //     )
    //     .subscribe((query) => {

    //       this.store?.getTickets({ projectUuid: this.projectUuid, query });

    //       this.store?.setCurrentPage(query.page);

    //     });



    // }
    ngOnInit() {

    this.route.paramMap.subscribe(params => {

      const uuid = params.get('projectUuid');

      if (!uuid) return;

      this.projectUuid = uuid;

      console.log("Project UUID:", uuid);

      // ALWAYS fetch AFTER uuid is ready
      this.store.getTickets({
        projectUuid: uuid,
        query: defaultQuery
      });

    });

    this.inputSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged(), // ❗ FIXED (you used wrong operator before)
        takeUntilDestroyed(this.destroyed)
      )
      .subscribe((query) => {

        if (!this.projectUuid) return;

        this.store.getTickets({
          projectUuid: this.projectUuid,
          query
        });

        this.store.setCurrentPage(query.page);

      });

  }

    onFileChange = (files: FileList) => {

      const fileArray:
        { name: string, size: string }[] = [];

      Array.from(files).forEach(file => {

        fileArray.push({
          name: file.name,
          size: formatFileSize(file.size)
        });

        this.filesToSave.push(file);

      });

      this.files.set(fileArray);

    };

    removeFile = (file: File) => {

      this.files.set([
        ...this.files().filter(
          currentFile =>
            currentFile.name !== file.name
        )
      ]);

      this.filesToSave =
        this.filesToSave.filter(
          currentFile =>
            currentFile.name !== file.name
        );

    }

    saveTicket = (ticketForm: NgForm) => {

      const form =
        getFormDate(
          ticketForm?.value,
          this.filesToSave
        );
  form.append('projectUuid', this.projectUuid ); // ADMIN | MEMBER


      this.store.saveTicket(form);

      ticketForm?.reset();

      this.files.set([]);

      this.filesToSave = [];

    }

    searchTickets = (query: IQuery) =>
      this.inputSubject.next(query);

    filterTickets = (query: IQuery) => {

      this.store?.setCurrentPage(query.page);

      this.store?.getTickets({ projectUuid: this.projectUuid, query });

    }

    isTicketModalOpen = false;

    openTicketModal(): void {

      this.isTicketModalOpen = true;

      document.body.classList.add('overflow-hidden');

    }

    closeTicketModal(): void {

      this.isTicketModalOpen = false;

      document.body.classList.remove('overflow-hidden');

    }

    onBackdropClick(event: MouseEvent): void {

      if (
        (event.target as HTMLElement).id
        === 'ticket-modal-backdrop'
      ) {

        this.closeTicketModal();

      }

    }

  }