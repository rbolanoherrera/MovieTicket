import { Component, ComponentRef, signal, ViewChild, ViewContainerRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MicroFrontendService } from './micro-frontend.service';

@Component({
  selector: 'app-root',
  //imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('MovieTicket');

  @ViewChild('movieList', { read: ViewContainerRef, static: true }) listContainer!: ViewContainerRef;
  @ViewChild('ticketAvailability', { read: ViewContainerRef, static: true }) availabilityContainer!: ViewContainerRef;

  private listComponentRef: ComponentRef<any> | null = null;
  private availabilityComponentRef: ComponentRef<any> | null = null;

  constructor(private microFrontendService: MicroFrontendService) {
    
  }

  async ngOnInit() {
    try {
      const listComponent = await this.microFrontendService.loadRemoteComponent('movie-list') as { App: any };

      this.listContainer.clear();
      this.listComponentRef = this.listContainer.createComponent(listComponent.App);
      this.listComponentRef.changeDetectorRef.detectChanges();
    } catch (error) {
      console.error('Error loading remote component movie-list:', error);
    }

    try {
      const availabilityComponent = await this.microFrontendService.loadRemoteComponent('ticket-availability') as { App: any };

      this.availabilityContainer.clear();
      this.availabilityComponentRef = this.availabilityContainer.createComponent(availabilityComponent.App);
      this.availabilityComponentRef.changeDetectorRef.detectChanges();
    } catch (error) {
      console.error('Error loading remote component ticket-availability:', error);
    }

  }

  ngOndestroy() {

    if (this.listComponentRef)
      this.listComponentRef.destroy();

    if (this.availabilityComponentRef)
      this.availabilityComponentRef.destroy();
  }

}
