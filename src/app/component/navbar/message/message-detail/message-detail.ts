import { ChangeDetectorRef, Component, effect, ElementRef, inject, input, Renderer2, viewChild } from '@angular/core';
import { getFormDate } from '../../../../utils/fileutils';
import { FormsModule, NgForm } from '@angular/forms';
import { AppStore } from '../../../../store/app.store';
import { CommonModule, Location } from '@angular/common';
import { Emails } from '../../../../pipe/emails.pipe';

@Component({
  selector: 'app-message-detail',
  imports: [CommonModule , FormsModule ,Emails],
  templateUrl: './message-detail.html',
})
export class MessageDetail {
  messageRef = viewChild<ElementRef<HTMLDivElement>>('message');
  conversationId = input<string>('');
  readonly store = inject(AppStore);
  private readonly location = inject(Location);
  private renderer = inject(Renderer2);
  private changeDetector = inject(ChangeDetectorRef);

  constructor() {
    effect(() => {
      this.store?.conversation();
      this.scrollChatWindow();
      this.changeDetector.markForCheck();
    });
  }

  ngAfterViewChecked () {
    this.scrollChatWindow();
  }

  ngOnInit(): void {
    if (this.conversationId()) {
      this.store.getConversation(this.conversationId());
    }
  }

  goBack = () => this.location.back();

  saveMessage = (form: NgForm) => {
    console.log(form.value);
    this.store.replyToMessage(getFormDate(form.value, null));
    form.reset({ toEmail: form.value.toEmail })
  };

  private scrollChatWindow = () => {
    if(this.messageRef && this.messageRef()?.nativeElement && this.messageRef()?.nativeElement.scrollHeight > this.messageRef()?.nativeElement.scrollTop) {
      this.renderer.setProperty(this.messageRef()?.nativeElement, 'scrollTop', this.messageRef()?.nativeElement.scrollHeight);
    }
  };
}
